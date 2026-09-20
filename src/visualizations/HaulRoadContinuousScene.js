/**
 * FOSAFE Smart Safety Radar & LiDAR Proximity Field
 * Replaces the confusing curvy road and fog blobs with a clean,
 * modern, high-tech fleet proximity radar and collision detection mesh.
 *
 * Highlights:
 * - Concentric LiDAR distance rings (50m, 100m, 150m, 200m)
 * - Luminous 360° radar sweep beam with trailing phosphorescent glow
 * - Dynamic mine fleet nodes with pulsing safety halos and ping responses
 * - Real-time proximity safety vector showing closing distance between vehicles
 * - Seamless Light Mode (Drafting Blueprint) & Dark Mode (Deep Titanium) support
 * - Scroll-driven camera scaling & smooth mouse parallax
 * - Capped DPR and 60fps performance via master ticker
 */

import { ticker } from '../lib/ticker.js';
import { themeManager } from '../lib/theme.js';

export class HaulRoadContinuousScene {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    // Theme state
    this.theme = themeManager.getTheme() || 'dark';

    // Animation time & radar sweep angle
    this.time = 0;
    this.radarAngle = 0;

    // Scroll progress (0.0 at top, 1.0 at bottom)
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;

    // Pointer parallax
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Fleet Vehicle Nodes on Radar
    this.vehicles = [
      {
        id: 'D-07',
        name: 'HAUL TRUCK D-07',
        baseAngle: 0.85,
        baseDist: 110,
        speed: 0.0008,
        state: 'warning',
        type: 'CAT 797F (400t)',
        lastPing: 0
      },
      {
        id: 'S-01',
        name: 'SCOUT UNIT S-01',
        baseAngle: 1.15,
        baseDist: 145,
        speed: -0.0006,
        state: 'warning',
        type: 'LIGHT PICKUP',
        lastPing: 0
      },
      {
        id: 'D-12',
        name: 'HAUL TRUCK D-12',
        baseAngle: 2.7,
        baseDist: 210,
        speed: 0.0004,
        state: 'normal',
        type: 'CAT 797F (400t)',
        lastPing: 0
      },
      {
        id: 'L-04',
        name: 'PIT SHOVEL L-04',
        baseAngle: 4.2,
        baseDist: 260,
        speed: 0.0001,
        state: 'normal',
        type: 'ELECTRIC SHOVEL',
        lastPing: 0
      },
      {
        id: 'W-02',
        name: 'WATER TANKER W-02',
        baseAngle: 5.4,
        baseDist: 180,
        speed: -0.0003,
        state: 'normal',
        type: 'DUST SUPPRESSION',
        lastPing: 0
      }
    ];

    this.init();
  }

  init() {
    this.handleResize = this.resize.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleScroll = this.onScroll.bind(this);

    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    this.unsubscribeTheme = themeManager.subscribe((theme) => {
      this.theme = theme;
    });

    this.resize();

    // Register with master ticker loop
    ticker.add('haul_road_radar_scene', (delta) => {
      this.update(delta);
      this.draw();
    });
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;

    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  onMouseMove(e) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    this.mouse.targetX = nx * 24;
    this.mouse.targetY = ny * 24;
  }

  onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      this.targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / docHeight));
    }
  }

  update(delta) {
    this.time += delta;

    // Smooth lerp mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Smooth lerp scroll progress
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Rotate radar sweep beam (~3.5 seconds per full 360° turn)
    this.radarAngle = (this.radarAngle + 0.016 * delta) % (Math.PI * 2);

    // Update vehicle positions and check radar sweep hit
    this.vehicles.forEach(v => {
      v.baseAngle = (v.baseAngle + v.speed * delta) % (Math.PI * 2);
      if (v.baseAngle < 0) v.baseAngle += Math.PI * 2;

      // Check if radar sweep just crossed vehicle angle
      let angleDiff = Math.abs(this.radarAngle - v.baseAngle);
      if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
      if (angleDiff < 0.08) {
        v.lastPing = this.time;
      }
    });
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    if (!ctx || w === 0 || h === 0) return;

    const isLight = this.theme === 'light';

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Background base fill
    ctx.fillStyle = isLight ? '#F1F5F9' : '#07090D';
    ctx.fillRect(0, 0, w, h);

    // Subtle technical grid pattern
    this.drawBackgroundGrid(ctx, w, h, isLight);

    // Dynamic radar origin: centered right-of-center on desktop, center on mobile
    const isMobile = w < 768;
    const originX = isMobile ? (w * 0.5 + this.mouse.x) : (w * 0.62 + this.mouse.x);
    const originY = h * 0.52 + this.mouse.y;

    // Zoom factor based on scroll progress (brings vehicles closer during collision stations)
    const zoom = 1.0 + Math.sin(this.scrollProgress * Math.PI) * 0.25;

    ctx.save();
    ctx.translate(originX, originY);
    ctx.scale(zoom, zoom);

    // 1. Concentric Range Rings (50m, 100m, 150m, 200m, 280m)
    this.drawRangeRings(ctx, isLight);

    // 2. Compass Crosshairs and Degree Ticks
    this.drawCrosshairs(ctx, isLight);

    // 3. Luminous 360° Radar Sweep Beam
    this.drawRadarSweep(ctx, isLight);

    // 4. Vehicle Nodes & Proximity Beams
    this.drawFleetNodes(ctx, isLight);

    ctx.restore();

    // 5. Ambient HUD Status Overlay in Corners
    this.drawHudOverlay(ctx, w, h, isLight);
  }

  drawBackgroundGrid(ctx, w, h, isLight) {
    ctx.save();
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.035)' : 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;

    const gridSize = 48;
    ctx.beginPath();
    for (let x = 0; x < w; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  drawRangeRings(ctx, isLight) {
    const rings = [
      { radius: 60, label: '50m' },
      { radius: 120, label: '100m' },
      { radius: 180, label: '150m' },
      { radius: 240, label: '200m' },
      { radius: 310, label: '250m' }
    ];

    ctx.save();
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    rings.forEach((r, idx) => {
      // Circle stroke
      ctx.beginPath();
      ctx.arc(0, 0, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = isLight 
        ? (idx === 1 ? 'rgba(217, 119, 6, 0.25)' : 'rgba(15, 23, 42, 0.08)')
        : (idx === 1 ? 'rgba(245, 158, 11, 0.28)' : 'rgba(255, 255, 255, 0.07)');
      ctx.lineWidth = idx === 1 ? 1.5 : 1;
      if (idx === 1) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();

      // Range Label on cardinal axis
      ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.65)' : 'rgba(148, 163, 184, 0.55)';
      ctx.fillText(r.label, 0, -r.radius - 6);
    });

    ctx.restore();
  }

  drawCrosshairs(ctx, isLight) {
    ctx.save();
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    const maxDist = 340;
    // North-South line
    ctx.beginPath();
    ctx.moveTo(0, -maxDist);
    ctx.lineTo(0, maxDist);
    // East-West line
    ctx.moveTo(-maxDist, 0);
    ctx.lineTo(maxDist, 0);
    ctx.stroke();

    // Center Origin Dot
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = isLight ? '#D97706' : '#F59E0B';
    ctx.fill();

    ctx.restore();
  }

  drawRadarSweep(ctx, isLight) {
    const sweepRadius = 320;
    const sweepAngle = this.radarAngle;
    const beamSpread = 0.55; // Spread in radians (~30 degrees)

    ctx.save();

    // Trailing Sweep Arc with Canvas Gradient
    const sweepGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, sweepRadius);
    if (isLight) {
      sweepGrad.addColorStop(0, 'rgba(217, 119, 6, 0.12)');
      sweepGrad.addColorStop(0.7, 'rgba(217, 119, 6, 0.04)');
      sweepGrad.addColorStop(1, 'rgba(217, 119, 6, 0.0)');
    } else {
      sweepGrad.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      sweepGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.05)');
      sweepGrad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
    }

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, sweepRadius, sweepAngle - beamSpread, sweepAngle, false);
    ctx.closePath();
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    // Sharp Leading Edge Beam
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(sweepAngle) * sweepRadius, Math.sin(sweepAngle) * sweepRadius);
    ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.45)' : 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  drawFleetNodes(ctx, isLight) {
    const coords = [];

    // Calculate node Cartesian positions
    this.vehicles.forEach(v => {
      const x = Math.cos(v.baseAngle) * v.baseDist;
      const y = Math.sin(v.baseAngle) * v.baseDist;
      coords.push({ v, x, y });
    });

    // 1. Draw Proximity Collision Vectors between nearby units (D-07 and S-01)
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const p1 = coords[i];
        const p2 = coords[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If within 90m proximity envelope
        if (dist < 90) {
          ctx.save();
          ctx.strokeStyle = isLight ? 'rgba(220, 38, 38, 0.6)' : 'rgba(239, 68, 68, 0.75)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Midpoint Distance Pill
          const midX = (p1.x + p2.x) * 0.5;
          const midY = (p1.y + p2.y) * 0.5;

          ctx.fillStyle = isLight ? '#FFFFFF' : '#111622';
          ctx.strokeStyle = isLight ? 'rgba(220, 38, 38, 0.5)' : 'rgba(239, 68, 68, 0.6)';
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.roundRect(midX - 28, midY - 9, 56, 18, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isLight ? '#DC2626' : '#EF4444';
          ctx.font = '700 8.5px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('08.4m ALERT', midX, midY);

          ctx.restore();
        }
      }
    }

    // 2. Draw each Vehicle Blip
    coords.forEach(({ v, x, y }) => {
      ctx.save();

      const timeSincePing = this.time - v.lastPing;
      const isPinged = timeSincePing < 0.6;
      const pingAlpha = Math.max(0, 1 - timeSincePing / 0.6);

      // Safe vs Caution colors
      const isCaution = v.state === 'warning';
      const nodeColor = isCaution
        ? (isLight ? '#D97706' : '#F59E0B')
        : (isLight ? '#059669' : '#10B981');

      // Glowing Ping Wave when radar beam hits node
      if (isPinged) {
        ctx.beginPath();
        ctx.arc(x, y, 12 + pingAlpha * 18, 0, Math.PI * 2);
        ctx.strokeStyle = isCaution
          ? `rgba(245, 158, 11, ${pingAlpha * 0.5})`
          : `rgba(16, 185, 129, ${pingAlpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Safety Halo Buffer (Dashed Circle)
      ctx.beginPath();
      ctx.arc(x, y, isCaution ? 22 : 16, 0, Math.PI * 2);
      ctx.strokeStyle = isCaution
        ? (isLight ? 'rgba(217, 119, 6, 0.4)' : 'rgba(245, 158, 11, 0.35)')
        : (isLight ? 'rgba(5, 150, 105, 0.3)' : 'rgba(16, 185, 129, 0.25)');
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.stroke();

      // Solid Node Core
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Heading Vector Tip
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(v.baseAngle + Math.PI * 0.5) * 12, y + Math.sin(v.baseAngle + Math.PI * 0.5) * 12);
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Monospace Vehicle Label
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLight ? '#0F172A' : '#F8FAFC';
      ctx.fillText(v.id, x + 8, y - 6);

      ctx.font = '400 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = isLight ? '#64748B' : '#94A3B8';
      ctx.fillText(v.state === 'warning' ? 'PROX CAUTION' : 'PERIMETER SAFE', x + 8, y + 5);

      ctx.restore();
    });
  }

  drawHudOverlay(ctx, w, h, isLight) {
    ctx.save();
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.45)' : 'rgba(148, 163, 184, 0.35)';

    // Top-Left Telemetry Tag
    ctx.textAlign = 'left';
    ctx.fillText('RADAR 360° // 40kHz SENSOR FUSION ACTIVE', 24, h - 24);

    // Top-Right Pit Sector Tag
    ctx.textAlign = 'right';
    ctx.fillText('PIT SECTOR 04 // LATENCY <45ms', w - 24, h - 24);

    ctx.restore();
  }

  destroy() {
    ticker.remove('haul_road_radar_scene');
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('scroll', this.handleScroll);
    if (this.unsubscribeTheme) this.unsubscribeTheme();
  }
}
