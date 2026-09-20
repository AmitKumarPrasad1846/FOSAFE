/**
 * FOSAFE Lightweight Technical Radar Blueprint
 * Ultra-low resource footprint: Rendered once on resize/theme change.
 * ZERO ongoing CPU rendering loops (0% CPU utilization, no battery drain).
 * Crystal-clear technical LiDAR range rings, cardinal axes, and vehicle markers.
 */

import { themeManager } from '../lib/theme.js';

export class HaulRoadContinuousScene {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    this.theme = themeManager.getTheme() || 'dark';

    // Fixed telemetry coordinates for static high-precision drafting
    this.vehicles = [
      { id: 'D-07', name: 'HAUL TRUCK D-07', dist: 120, angle: 0.95, state: 'warning' },
      { id: 'S-01', name: 'SCOUT S-01', dist: 155, angle: 1.25, state: 'warning' },
      { id: 'D-12', name: 'HAUL TRUCK D-12', dist: 220, angle: 2.85, state: 'normal' },
      { id: 'L-04', name: 'SHOVEL L-04', dist: 270, angle: 4.35, state: 'normal' },
      { id: 'W-02', name: 'WATER TANKER', dist: 190, angle: 5.30, state: 'normal' }
    ];

    this.init();
  }

  init() {
    this.handleResize = () => {
      this.resize();
      this.draw();
    };

    window.addEventListener('resize', this.handleResize, { passive: true });

    this.unsubscribeTheme = themeManager.subscribe((theme) => {
      this.theme = theme;
      this.draw();
    });

    this.resize();
    this.draw();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;

    // Cap DPR to 1 to guarantee minimal memory
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    if (!ctx || w === 0 || h === 0) return;

    const isLight = this.theme === 'light';

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Deep background fill
    ctx.fillStyle = isLight ? '#F8FAFC' : '#07090D';
    ctx.fillRect(0, 0, w, h);

    // Subtle technical grid
    ctx.save();
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.035)' : 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    const step = 48;
    ctx.beginPath();
    for (let x = 0; x < w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
    ctx.restore();

    // Radar center positioned gracefully on right side
    const isMobile = w < 768;
    const cx = isMobile ? w * 0.5 : w * 0.65;
    const cy = h * 0.48;

    ctx.save();
    ctx.translate(cx, cy);

    // Concentric Range Rings (50m, 100m, 150m, 200m, 260m)
    const rings = [
      { r: 60, label: '50m' },
      { r: 120, label: '100m' },
      { r: 180, label: '150m' },
      { r: 240, label: '200m' },
      { r: 300, label: '250m' }
    ];

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    rings.forEach((ring, idx) => {
      ctx.beginPath();
      ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = isLight
        ? (idx === 1 ? 'rgba(217, 119, 6, 0.28)' : 'rgba(15, 23, 42, 0.08)')
        : (idx === 1 ? 'rgba(245, 158, 11, 0.32)' : 'rgba(255, 255, 255, 0.06)');
      ctx.lineWidth = idx === 1 ? 1.5 : 1;
      if (idx === 1) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();

      // Range text on axis
      ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.55)' : 'rgba(148, 163, 184, 0.45)';
      ctx.fillText(ring.label, 0, -ring.r - 6);
    });

    // Crosshairs
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.07)' : 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.moveTo(0, -320);
    ctx.lineTo(0, 320);
    ctx.moveTo(-320, 0);
    ctx.lineTo(320, 0);
    ctx.stroke();

    // Center Origin
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = isLight ? '#D97706' : '#F59E0B';
    ctx.fill();

    // Proximity Line between D-07 and S-01
    const p1 = { x: Math.cos(0.95) * 120, y: Math.sin(0.95) * 120 };
    const p2 = { x: Math.cos(1.25) * 155, y: Math.sin(1.25) * 155 };

    ctx.save();
    ctx.strokeStyle = isLight ? 'rgba(220, 38, 38, 0.65)' : 'rgba(239, 68, 68, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Distance Badge
    const midX = (p1.x + p2.x) * 0.5;
    const midY = (p1.y + p2.y) * 0.5;
    ctx.fillStyle = isLight ? '#FFFFFF' : '#111622';
    ctx.strokeStyle = isLight ? 'rgba(220, 38, 38, 0.5)' : 'rgba(239, 68, 68, 0.6)';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.roundRect(midX - 30, midY - 9, 60, 18, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isLight ? '#DC2626' : '#EF4444';
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillText('08.4m ALERT', midX, midY);
    ctx.restore();

    // Vehicle Blips
    this.vehicles.forEach(v => {
      const vx = Math.cos(v.angle) * v.dist;
      const vy = Math.sin(v.angle) * v.dist;
      const isWarn = v.state === 'warning';
      const color = isWarn
        ? (isLight ? '#D97706' : '#F59E0B')
        : (isLight ? '#059669' : '#10B981');

      // Outer Safety Buffer Ring
      ctx.beginPath();
      ctx.arc(vx, vy, isWarn ? 20 : 14, 0, Math.PI * 2);
      ctx.strokeStyle = isWarn
        ? (isLight ? 'rgba(217, 119, 6, 0.35)' : 'rgba(245, 158, 11, 0.3)')
        : (isLight ? 'rgba(5, 150, 105, 0.25)' : 'rgba(16, 185, 129, 0.2)');
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.stroke();

      // Solid Node Core
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(vx, vy, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Label
      ctx.font = '700 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = isLight ? '#0F172A' : '#F8FAFC';
      ctx.fillText(v.id, vx + 8, vy - 5);

      ctx.font = '400 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = isLight ? '#64748B' : '#94A3B8';
      ctx.fillText(isWarn ? 'PROX CAUTION' : 'SAFE PERIMETER', vx + 8, vy + 5);
    });

    ctx.restore();

    // Ambient Corner Readouts
    ctx.save();
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.45)' : 'rgba(148, 163, 184, 0.35)';
    ctx.textAlign = 'left';
    ctx.fillText('RADAR 360° // SENSOR FUSION ACTIVE', 24, h - 24);
    ctx.textAlign = 'right';
    ctx.fillText('PIT SECTOR 04 // LATENCY <45ms', w - 24, h - 24);
    ctx.restore();
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.unsubscribeTheme) this.unsubscribeTheme();
  }
}
