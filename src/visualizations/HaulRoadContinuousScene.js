/**
 * FOSAFE v2 Persistent Haul-Road Continuous Scene
 * One continuous, scroll-driven visual journey through an open-cast mine haul road.
 * Transforms across 10 scroll stations: Clear -> Fog Collapse -> Sensor Fusion ->
 * Adaptive Envelopes -> Pit Dispatch Overview.
 *
 * Performance:
 * - Uses shared MasterTicker (no private rAF loops)
 * - Layered procedural fog noise on downscaled offscreen buffer
 * - Capped DPR (1.0–1.5x)
 * - Batched 2D canvas drawing with crisp 1px survey linework
 */

import { ticker } from '../lib/ticker.js';

export class HaulRoadContinuousScene {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    // Scroll progress (0.0 to 1.0)
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;

    // Pointer parallax (lerped)
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.hasPointerMoved = false;

    // Offscreen fog buffer (rendered at 0.5x resolution for 60fps)
    this.fogCanvas = document.createElement('canvas');
    this.fogCtx = this.fogCanvas.getContext('2d');
    this.fogTime = 0;
    this.fogDensity = 0.18; // Controlled dynamically by scroll or manual scrubber

    // Haul Road Spline points (normalized 0..1)
    this.roadSpline = [
      { x: 0.15, y: -0.1 },
      { x: 0.32, y: 0.22 },
      { x: 0.52, y: 0.48 },
      { x: 0.45, y: 0.75 },
      { x: 0.70, y: 1.15 }
    ];

    // Vehicles with haulage kinematics
    this.vehicles = [
      {
        id: 'D-07',
        name: 'CAT 797F // D-07',
        type: 'HAUL TRUCK (400t)',
        progress: 0.42,
        speed: 0.0006,
        state: 'warning',
        color: '#F59E0B',
        baseRadius: 42,
        isPrimary: true,
        distToObstacle: 8.4,
        relativeSpeed: '+4.2 km/h'
      },
      {
        id: 'D-12',
        name: 'KOMATSU 930E // D-12',
        type: 'HAUL TRUCK (360t)',
        progress: 0.78,
        speed: 0.00045,
        state: 'normal',
        color: '#10B981',
        baseRadius: 36,
        isPrimary: false,
        distToObstacle: 54.0,
        relativeSpeed: '+0.0 km/h'
      },
      {
        id: 'S-01',
        name: 'SURVEY JEEP // S-01',
        type: 'LIGHT VEHICLE',
        progress: 0.28,
        speed: 0.0011,
        state: 'critical',
        color: '#EF4444',
        baseRadius: 26,
        isPrimary: false,
        distToObstacle: 6.8,
        relativeSpeed: '-12.4 km/h'
      },
      {
        id: 'L-04',
        name: 'EXCAVATOR // L-04',
        type: 'ELECTRIC SHOVEL',
        progress: 0.12,
        speed: 0.0,
        state: 'normal',
        color: '#10B981',
        baseRadius: 30,
        isPrimary: false,
        distToObstacle: 95.0,
        relativeSpeed: 'STATIONARY'
      }
    ];

    // Obstacle ahead of D-07
    this.obstacle = {
      label: 'UNSEEN OBSTACLE // ROCKFALL & BERM BREACH',
      progress: 0.49,
      distance: 8.4
    };

    // Sensor pulse waves
    this.sensorPulse = 0;

    this.init();
  }

  init() {
    this.handleResize();
    this.bindEvents();

    // Register with unified MasterTicker
    ticker.add('haul_road_continuous_scene', (delta, elapsed, currentTime) => {
      this.update(delta, elapsed, currentTime);
      this.render();
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.handleResize(), { passive: true });

    window.addEventListener('scroll', () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      this.targetScrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    }, { passive: true });

    window.addEventListener('pointermove', (e) => {
      this.hasPointerMoved = true;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      this.mouse.targetX = nx * 18; // Max 18px subtle shift
      this.mouse.targetY = ny * 18;
    }, { passive: true });
  }

  handleResize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, ticker.maxDpr);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    // Fog buffer at 0.5x resolution for locked 60FPS
    const fogScale = 0.5;
    this.fogCanvas.width = Math.max(64, Math.floor(this.width * fogScale));
    this.fogCanvas.height = Math.max(64, Math.floor(this.height * fogScale));
  }

  setManualFogDensity(density) {
    // Allows Section 04 visibility simulator to scrub the scene's fog
    this.fogDensity = Math.max(0.05, Math.min(1.0, density));
  }

  update(delta, elapsed) {
    // Smooth scroll interpolation (lerp)
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Pointer smoothing
    if (!this.hasPointerMoved) {
      // Gentle auto drift if no mouse (touch devices / initial load)
      this.mouse.targetX = Math.sin(elapsed * 0.0008) * 10;
      this.mouse.targetY = Math.cos(elapsed * 0.0006) * 10;
    }
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Move vehicles along spline
    this.vehicles.forEach(v => {
      v.progress = (v.progress + v.speed * (delta / 16.6)) % 1.0;
    });

    // Sensor pulse wave
    this.sensorPulse = (this.sensorPulse + 0.02 * (delta / 16.6)) % 1.0;

    // Dynamic fog density calculation based on scroll progress
    // Station 01 (0.0-0.15): ~0.15 (clear)
    // Station 02 (0.15-0.30): spikes to ~0.88 (dense fog collapse)
    // Station 04 (0.40-0.55): controlled by scrubber or scroll
    // Station 06+ (0.60-1.0): settles to ~0.35 (aerial survey overview)
    const sp = this.scrollProgress;
    if (sp < 0.15) {
      this.fogDensity = 0.15 + (sp / 0.15) * 0.15;
    } else if (sp >= 0.15 && sp < 0.35) {
      const t = (sp - 0.15) / 0.2;
      this.fogDensity = 0.30 + t * 0.58; // Climbs to 0.88
    } else if (sp >= 0.35 && sp < 0.60) {
      const t = (sp - 0.35) / 0.25;
      this.fogDensity = 0.88 - t * 0.40; // Adapts to 0.48
    } else {
      this.fogDensity = 0.48 - (sp - 0.60) * 0.25; // 0.38 overview
    }

    this.fogTime += delta * 0.0004;
  }

  // Catmull-Rom or cubic evaluation along road spline
  getSplinePoint(t) {
    const pts = this.roadSpline;
    const n = pts.length - 1;
    const clampedT = Math.max(0, Math.min(0.999, t));
    const p = clampedT * n;
    const i = Math.floor(p);
    const u = p - i;

    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[Math.min(n, i + 1)];
    const p3 = pts[Math.min(n, i + 2)];

    // Catmull-Rom calculation
    const u2 = u * u;
    const u3 = u2 * u;

    const x = 0.5 * ((2 * p1.x) +
      (-p0.x + p2.x) * u +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3);

    const y = 0.5 * ((2 * p1.y) +
      (-p0.y + p2.y) * u +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3);

    return {
      x: x * this.width,
      y: y * this.height
    };
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Clear with deep void graphite base
    ctx.fillStyle = '#06080C';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    // Apply camera parallax
    ctx.translate(this.mouse.x, this.mouse.y);

    // 2. Draw Topographic Benches & Contour Lines
    this.drawContours(ctx, w, h);

    // 3. Draw Survey Coordinate Grid & Registration Marks
    this.drawSurveyGrid(ctx, w, h);

    // 4. Draw Haul Road Centerline and Shoulders
    this.drawHaulRoad(ctx, w, h);

    // 5. Draw Active Vehicles, Envelopes & Collision Vectors
    this.drawFleetNodes(ctx, w, h);

    // 6. Draw Layered Atmospheric Fog Noise
    this.drawAtmosphericFog(ctx, w, h);

    // 7. Draw Station-Specific Overlays (Camera Zoom / Sensor Pulses)
    this.drawStationContextOverlays(ctx, w, h);

    ctx.restore();

    // 8. Un-transformed Screen-Space Survey Instrumentation
    this.drawScreenInstrumentation(ctx, w, h);
  }

  drawContours(ctx, w, h) {
    const sp = this.scrollProgress;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Topographic bench contours
    const contours = [
      { y: 0.18, elev: '+260m' },
      { y: 0.38, elev: '+240m' },
      { y: 0.58, elev: '+220m' },
      { y: 0.78, elev: '+200m' },
      { y: 0.94, elev: '+180m' }
    ];

    contours.forEach(c => {
      const cy = c.y * h;
      ctx.beginPath();
      ctx.moveTo(0, cy - 20);
      ctx.bezierCurveTo(w * 0.35, cy + 40, w * 0.65, cy - 50, w, cy + 15);
      ctx.stroke();

      // Elevation text tag
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fillText(`BENCH ELEV ${c.elev}`, 24, cy - 10);
    });

    ctx.restore();
  }

  drawSurveyGrid(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;

    const gridSize = 120;
    const cols = Math.ceil(w / gridSize);
    const rows = Math.ceil(h / gridSize);

    // Grid lines
    for (let c = 0; c <= cols; c++) {
      const x = c * gridSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      const y = r * gridSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Survey crosshairs at intersections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let c = 1; c < cols; c += 2) {
      for (let r = 1; r < rows; r += 2) {
        const x = c * gridSize;
        const y = r * gridSize;
        const s = 4;
        ctx.beginPath();
        ctx.moveTo(x - s, y);
        ctx.lineTo(x + s, y);
        ctx.moveTo(x, y - s);
        ctx.lineTo(x, y + s);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawHaulRoad(ctx, w, h) {
    ctx.save();
    const steps = 60;
    const roadHalfWidth = 28;

    // Road fill surface
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const pt = this.getSplinePoint(i / steps);
      if (i === 0) ctx.moveTo(pt.x - roadHalfWidth, pt.y);
      else ctx.lineTo(pt.x - roadHalfWidth, pt.y);
    }
    for (let i = steps; i >= 0; i--) {
      const pt = this.getSplinePoint(i / steps);
      ctx.lineTo(pt.x + roadHalfWidth, pt.y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(18, 23, 32, 0.65)';
    ctx.fill();

    // Road shoulders (berm boundaries)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Road Centerline with dashes
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    for (let i = 0; i <= steps; i++) {
      const pt = this.getSplinePoint(i / steps);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    ctx.restore();
  }

  drawFleetNodes(ctx, w, h) {
    const sp = this.scrollProgress;

    // Dynamic safety radius scale factor (increases in fog stations)
    const bufferScale = (sp > 0.15 && sp < 0.6) ? 1.45 : 1.0;

    this.vehicles.forEach(v => {
      const pos = this.getSplinePoint(v.progress);
      const radius = v.baseRadius * bufferScale;

      ctx.save();
      ctx.translate(pos.x, pos.y);

      // 1. Safety perimeter ring
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = v.state === 'critical' ? 'rgba(239, 68, 68, 0.45)' :
                        v.state === 'warning' ? 'rgba(245, 158, 11, 0.38)' :
                        'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();

      // 2. Pulse wave on primary vehicle (D-07)
      if (v.isPrimary) {
        ctx.beginPath();
        const pulseR = radius + this.sensorPulse * 24;
        ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 * (1 - this.sensorPulse)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Vehicle icon marker (Industrial lozenge / rectangle)
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.rect(-7, -12, 14, 24);
      ctx.fill();

      // Heading arrow indicator
      ctx.fillStyle = '#080A0F';
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.closePath();
      ctx.fill();

      // 4. Instrument Tag Annotation
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#F2F4F7';
      ctx.fillText(v.id, 16, -4);

      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(`${v.type.split(' ')[0]} · ${v.state.toUpperCase()}`, 16, 8);

      // 5. Distance vector line from D-07 to Obstacle
      if (v.isPrimary) {
        const obsPos = this.getSplinePoint(this.obstacle.progress);
        const dx = obsPos.x - pos.x;
        const dy = obsPos.y - pos.y;

        ctx.restore(); // Exit vehicle local transform
        ctx.save();

        // Vector line
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(obsPos.x, obsPos.y);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();

        // Obstacle marker
        ctx.beginPath();
        ctx.arc(obsPos.x, obsPos.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#F2F4F7';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Obstacle HUD tag
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#EF4444';
        ctx.fillText(`OBSTACLE: ${v.distToObstacle}m AHEAD`, obsPos.x + 10, obsPos.y - 6);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`CLOSING: ${v.relativeSpeed}`, obsPos.x + 10, obsPos.y + 6);

        ctx.restore();
        return;
      }

      ctx.restore();
    });
  }

  drawAtmosphericFog(ctx, w, h) {
    const fCtx = this.fogCtx;
    const fw = this.fogCanvas.width;
    const fh = this.fogCanvas.height;

    // Render low-res procedural fog on offscreen buffer
    fCtx.clearRect(0, 0, fw, fh);

    const t = this.fogTime;
    const density = this.fogDensity;

    // Value noise gradient blobs
    fCtx.save();
    for (let i = 0; i < 7; i++) {
      const gx = (Math.sin(t * 0.7 + i * 1.8) * 0.4 + 0.5) * fw;
      const gy = (Math.cos(t * 0.5 + i * 1.3) * 0.4 + 0.5) * fh;
      const gradR = (0.35 + i * 0.08) * Math.max(fw, fh);

      const radGrad = fCtx.createRadialGradient(gx, gy, 0, gx, gy, gradR);
      radGrad.addColorStop(0, `rgba(18, 24, 34, ${0.45 * density})`);
      radGrad.addColorStop(0.5, `rgba(14, 19, 28, ${0.28 * density})`);
      radGrad.addColorStop(1, 'rgba(10, 14, 20, 0)');

      fCtx.fillStyle = radGrad;
      fCtx.fillRect(0, 0, fw, fh);
    }
    fCtx.restore();

    // Composite scaled fog buffer onto main canvas
    ctx.save();
    ctx.globalAlpha = Math.min(1.0, density * 1.2);
    ctx.drawImage(this.fogCanvas, 0, 0, fw, fh, 0, 0, w, h);
    ctx.restore();
  }

  drawStationContextOverlays(ctx, w, h) {
    const sp = this.scrollProgress;

    // Station 02: Fog collapse sightline indicator
    if (sp >= 0.12 && sp <= 0.32) {
      const alpha = Math.sin(((sp - 0.12) / 0.2) * Math.PI);
      ctx.save();
      ctx.fillStyle = `rgba(239, 68, 68, ${0.08 * alpha})`;
      ctx.fillRect(0, 0, w, h);

      // Warning text across bottom
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = `rgba(239, 68, 68, ${0.85 * alpha})`;
      ctx.fillText('CRITICAL VISIBILITY COLLAPSE // SIGHTLINE < 15.0m // BRAKING ENVELOPE: 62.4m', 32, h - 40);
      ctx.restore();
    }
  }

  drawScreenInstrumentation(ctx, w, h) {
    ctx.save();

    // Top Right Survey Coordinates & Compass Heading
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.textAlign = 'right';
    ctx.fillText('LAT 23°47\'12" N  LON 86°24\'38" E', w - 48, 80);
    ctx.fillText('PIT SECTOR: BENCH-04C // RAMP-08', w - 48, 96);

    // Bottom Left Technical Scale Bar
    const barW = 100;
    const barX = 32;
    const barY = h - 28;

    ctx.textAlign = 'left';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(barX, barY);
    ctx.lineTo(barX + barW, barY);
    ctx.moveTo(barX, barY - 4);
    ctx.lineTo(barX, barY + 4);
    ctx.moveTo(barX + barW / 2, barY - 2);
    ctx.lineTo(barX + barW / 2, barY + 2);
    ctx.moveTo(barX + barW, barY - 4);
    ctx.lineTo(barX + barW, barY + 4);
    ctx.stroke();

    ctx.fillText('0', barX - 2, barY - 8);
    ctx.fillText('25m', barX + barW / 2 - 8, barY - 8);
    ctx.fillText('50m SCALE', barX + barW - 12, barY - 8);

    ctx.restore();
  }

  destroy() {
    ticker.remove('haul_road_continuous_scene');
  }
}
