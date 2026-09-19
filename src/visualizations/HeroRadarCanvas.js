/**
 * FOSAFE Hero Radar Canvas
 * Abstract open-cast mine haul-road environment with live vehicle nodes,
 * contour elevations, radar sweeps, drifting atmospheric fog, and pointer reactivity.
 */

export class HeroRadarCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.animationFrameId = null;
    this.isVisible = true;

    // Mouse pointer interaction (smooth dampened tilt/reaction)
    this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;

    // Fog particles
    this.fogParticles = [];
    this.numFog = 28;

    // Simulation time
    this.time = 0;

    // Vehicle paths and nodes
    this.vehicles = [
      {
        id: 'D-07',
        name: 'CAT 797F #07',
        t: 0.38,
        speed: 0.0007,
        status: 'warning',
        color: '#F59E0B',
        radius: 46,
        isPrimary: true,
        bearing: 342,
        distToObstacle: 8.4,
        hazardLabel: 'HAZARD AHEAD'
      },
      {
        id: 'D-12',
        name: 'KOMATSU 930E #12',
        t: 0.72,
        speed: 0.0005,
        status: 'normal',
        color: '#10B981',
        radius: 34,
        isPrimary: false,
        bearing: 118,
        distToObstacle: 42.6,
        hazardLabel: 'CLEAR LANE'
      },
      {
        id: 'S-01',
        name: 'SCOUT UNIT #01',
        t: 0.15,
        speed: 0.0011,
        status: 'critical',
        color: '#EF4444',
        radius: 28,
        isPrimary: false,
        bearing: 210,
        distToObstacle: 5.1,
        hazardLabel: 'INTERSECTION WARNING'
      },
      {
        id: 'L-04',
        name: 'SHOVEL L-04',
        t: 0.92,
        speed: 0,
        status: 'normal',
        color: '#627084',
        radius: 24,
        isPrimary: false,
        bearing: 45,
        distToObstacle: 95.0,
        hazardLabel: 'BENCH EXCAVATOR'
      }
    ];

    this.init();
  }

  init() {
    this.handleResize();
    this.initFog();

    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

    // Intersection observer to stop rendering when scrolled out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible && !this.animationFrameId) {
          this.render();
        }
      });
    }, { threshold: 0.05 });

    observer.observe(this.canvas);
    this.render();
  }

  handleResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  initFog() {
    this.fogParticles = [];
    for (let i = 0; i < this.numFog; i++) {
      this.fogParticles.push({
        x: Math.random() * (this.width || 1200),
        y: Math.random() * (this.height || 800),
        radius: 120 + Math.random() * 220,
        vx: 0.2 + Math.random() * 0.35,
        vy: (Math.random() - 0.5) * 0.15,
        opacity: 0.05 + Math.random() * 0.09
      });
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width && rect.height) {
      this.mouse.targetX = (e.clientX - rect.left) / rect.width;
      this.mouse.targetY = (e.clientY - rect.top) / rect.height;
    }
  }

  // Define the haul road curvilinear path through the open-cast pit
  getHaulRoadPoint(t, width, height) {
    // S-curve descending from top-right bench to bottom-left pit floor
    const cx = width * 0.55;
    const cy = height * 0.5;

    // Spline-like curve
    const x = cx + Math.sin(t * Math.PI * 2.2) * (width * 0.28) + (t - 0.5) * (width * 0.3);
    const y = height * 0.15 + t * (height * 0.72) + Math.cos(t * Math.PI * 1.8) * (height * 0.08);

    // Tangent for vehicle heading
    const dt = 0.01;
    const xNext = cx + Math.sin((t + dt) * Math.PI * 2.2) * (width * 0.28) + ((t + dt) - 0.5) * (width * 0.3);
    const yNext = height * 0.15 + (t + dt) * (height * 0.72) + Math.cos((t + dt) * Math.PI * 1.8) * (height * 0.08);

    const angle = Math.atan2(yNext - y, xNext - x);

    return { x, y, angle };
  }

  drawPitContours() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Subtle pointer parallax offset
    const offsetX = (this.mouse.x - 0.5) * 16;
    const offsetY = (this.mouse.y - 0.5) * 16;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    // 1. Haulage road ribbon
    ctx.lineWidth = 42;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#12161F';
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.02) {
      const p = this.getHaulRoadPoint(t, w, h);
      if (t === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // Haul road center dashed lane
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 12]);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.02) {
      const p = this.getHaulRoadPoint(t, w, h);
      if (t === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Haul road edge berms
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(98, 112, 132, 0.25)';
    ctx.stroke();

    // 2. Open-cast pit bench contour lines
    const contourBenches = [
      { elevation: '+480m', offset: 80, stroke: 'rgba(65, 76, 93, 0.16)' },
      { elevation: '+440m', offset: 160, stroke: 'rgba(65, 76, 93, 0.18)' },
      { elevation: '+410m', offset: 240, stroke: 'rgba(65, 76, 93, 0.22)' },
      { elevation: '+380m', offset: 320, stroke: 'rgba(65, 76, 93, 0.15)' }
    ];

    contourBenches.forEach((bench, index) => {
      ctx.beginPath();
      ctx.strokeStyle = bench.stroke;
      ctx.lineWidth = 1;

      for (let x = 0; x <= w; x += 40) {
        const y = h * 0.18 + index * (h * 0.2) + Math.sin(x * 0.005 + index) * 36 + Math.cos(x * 0.002) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Elevation label at right edge
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(98, 112, 132, 0.4)';
      ctx.fillText(`BENCH ELEV ${bench.elevation}`, w - 160, h * 0.18 + index * (h * 0.2) - 6);
    });

    // Haul road safety station markers
    const stationTicks = [0.15, 0.38, 0.62, 0.85];
    stationTicks.forEach((st, idx) => {
      const pt = this.getHaulRoadPoint(st, w, h);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.fillRect(pt.x - 3, pt.y - 3, 6, 6);

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(126, 136, 153, 0.5)';
      ctx.fillText(`STA-${idx + 1}`, pt.x + 8, pt.y + 3);
    });

    ctx.restore();
  }

  drawAtmosphericFog() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Mouse repulsion / dispersion factor
    const mx = this.mouse.x * w;
    const my = this.mouse.y * h;

    this.fogParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x - p.radius > w) p.x = -p.radius;
      if (p.y - p.radius > h) p.y = -p.radius;
      if (p.y + p.radius < 0) p.y = h + p.radius;

      // Subtle avoidance of pointer
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const force = (180 - dist) / 180 * 0.4;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      // Draw soft elliptical gradient
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `rgba(32, 39, 51, ${p.opacity})`);
      grad.addColorStop(0.6, `rgba(24, 30, 40, ${p.opacity * 0.6})`);
      grad.addColorStop(1, 'rgba(11, 13, 18, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawVehicleNodes() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Pointer parallax
    const offsetX = (this.mouse.x - 0.5) * 16;
    const offsetY = (this.mouse.y - 0.5) * 16;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    this.vehicles.forEach(veh => {
      // Advance position along the haul road
      if (veh.speed > 0) {
        veh.t += veh.speed;
        if (veh.t > 1) veh.t = 0;
      }

      const pt = this.getHaulRoadPoint(veh.t, w, h);

      // Dynamic safety radius circle
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, veh.radius, 0, Math.PI * 2);
      ctx.fillStyle = veh.status === 'warning' 
        ? 'rgba(245, 158, 11, 0.08)' 
        : veh.status === 'critical' 
          ? 'rgba(239, 68, 68, 0.12)' 
          : 'rgba(16, 185, 129, 0.05)';
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = veh.status === 'warning'
        ? 'rgba(245, 158, 11, 0.35)'
        : veh.status === 'critical'
          ? 'rgba(239, 68, 68, 0.45)'
          : 'rgba(16, 185, 129, 0.25)';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Forward velocity vector line
      const vectorLen = 32 + (veh.speed * 20000);
      const vx = pt.x + Math.cos(pt.angle) * vectorLen;
      const vy = pt.y + Math.sin(pt.angle) * vectorLen;

      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(vx, vy);
      ctx.strokeStyle = veh.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vehicle center glyph (heavy truck icon / diamond)
      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(pt.angle);

      // Chassis rectangle
      ctx.fillStyle = '#161B24';
      ctx.strokeStyle = veh.color;
      ctx.lineWidth = 1.5;
      ctx.fillRect(-10, -7, 20, 14);
      ctx.strokeRect(-10, -7, 20, 14);

      // Cab marker
      ctx.fillStyle = veh.color;
      ctx.fillRect(4, -5, 4, 10);
      ctx.restore();

      // Telemetry badge for primary target (D-07)
      if (veh.isPrimary) {
        // Distance line to hazard/ahead point
        const hazardX = pt.x + Math.cos(pt.angle) * 78;
        const hazardY = pt.y + Math.sin(pt.angle) * 78;

        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(hazardX, hazardY);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Hazard target reticle
        ctx.beginPath();
        ctx.arc(hazardX, hazardY, 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Technical callout box
        const calloutX = pt.x + 28;
        const calloutY = pt.y - 48;

        // Leader line
        ctx.beginPath();
        ctx.moveTo(pt.x + 12, pt.y - 12);
        ctx.lineTo(calloutX, calloutY + 28);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Card background
        ctx.fillStyle = 'rgba(17, 20, 27, 0.95)';
        ctx.strokeStyle = '#283243';
        ctx.lineWidth = 1;
        ctx.fillRect(calloutX, calloutY, 140, 56);
        ctx.strokeRect(calloutX, calloutY, 140, 56);

        // Top amber highlight strip
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(calloutX, calloutY, 140, 2);

        // Callout text lines
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#EDEFEF';
        ctx.fillText('TARGET: D-07', calloutX + 8, calloutY + 16);

        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('DIST: 08.4 m', calloutX + 8, calloutY + 32);

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#EF4444';
        ctx.fillText('MEDIUM RISK // FOG', calloutX + 8, calloutY + 46);
      } else {
        // Compact label for secondary nodes
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(193, 198, 208, 0.8)';
        ctx.fillText(veh.id, pt.x + 14, pt.y - 8);
      }
    });

    ctx.restore();
  }

  drawCompassRadarReticle() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Technical border reticles in corners
    const pad = 24;
    ctx.strokeStyle = 'rgba(98, 112, 132, 0.25)';
    ctx.lineWidth = 1;

    // Top-left crosshair
    ctx.beginPath();
    ctx.moveTo(pad, pad + 15);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + 15, pad);
    ctx.stroke();

    // Top-right crosshair
    ctx.beginPath();
    ctx.moveTo(w - pad - 15, pad);
    ctx.lineTo(w - pad, pad);
    ctx.lineTo(w - pad, pad + 15);
    ctx.stroke();

    // Bottom-right coordinates
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(126, 136, 153, 0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('GRID REF: 23°47\'29"N 86°25\'40"E // PIT SECTOR 04', w - pad, h - pad);
    ctx.textAlign = 'left';
  }

  render() {
    if (!this.isVisible) {
      this.animationFrameId = null;
      return;
    }

    this.time += 0.01;

    // Dampen mouse movement for subtle, non-disruptive parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Clear canvas with deep industrial dark
    this.ctx.fillStyle = '#0B0D12';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw layers in order
    this.drawPitContours();
    this.drawVehicleNodes();
    this.drawAtmosphericFog();
    this.drawCompassRadarReticle();

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
