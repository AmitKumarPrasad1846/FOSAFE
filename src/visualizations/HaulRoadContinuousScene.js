/**
 * FOSAFE v2 Optimized 3D Mine Haul Road Continuous Scene
 * A 3D perspective journey down into an open-cast pit haul road.
 *
 * Visual System:
 * - Genuine 3D perspective projection with camera depth and pitch
 * - Terraced pit elevation benches with depth contours
 * - 3D winding haul road with perspective width and dashed centerlines
 * - 3D 400-ton Haul Truck (CAT 797F // D-07) with dump body, cab, and forward headlights
 * - Forward LiDAR/radar sensor cone piercing into the fog
 * - Obstacle (Scout S-01) ahead with real-time 3D collision vector (08.4m ALERT)
 * - Dynamic 3D depth fog responsive to scroll progress & simulator scrubber
 * - High-performance single-pass rendering (no heavy offscreen canvas gradient loops)
 * - Seamless Dark Mode & Light Mode support
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

    // Theme
    this.theme = themeManager.getTheme() || 'dark';

    // Scroll & parallax
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.hasPointerMoved = false;

    // Fog state
    this.fogDensity = 0.20;
    this.manualFogOverride = null;
    this.fogTime = 0;

    // Primary Vehicle Telemetry (CAT 797F D-07)
    this.truckProgress = 0.45; // Position along 3D road (0.0 to 1.0)
    this.truckSpeed = 0.00035;

    // Sensor pulse animation
    this.sensorPulse = 0;

    // 3D Road Waypoints in World Coordinates (x: lateral -200..200, y: depth 0..1000, z: elevation 0..180)
    this.roadSpline3D = [
      { x: -140, y: 80,   z: 160 }, // Upper bench ramp entry
      { x: -70,  y: 280,  z: 130 },
      { x: 50,   y: 480,  z: 95 },  // Mid ramp curve
      { x: 130,  y: 680,  z: 60 },  // Lower hairpin
      { x: 20,   y: 880,  z: 25 },  // Approach to pit floor
      { x: -90,  y: 1040, z: 0 }    // Pit loading bench floor
    ];

    // Other Fleet Vehicles
    this.vehicles = [
      { id: 'D-07', name: 'CAT 797F // D-07', type: '400t HAUL TRUCK', progress: 0.42, state: 'warning', color: '#F59E0B' },
      { id: 'S-01', name: 'SCOUT JEEP // S-01', type: 'LIGHT VEHICLE', progress: 0.49, state: 'critical', color: '#EF4444' },
      { id: 'D-12', name: 'KOMATSU 930E', type: '360t HAUL TRUCK', progress: 0.78, state: 'normal', color: '#10B981' },
      { id: 'L-04', name: 'ELECTRIC SHOVEL', type: 'PIT SHOVEL', progress: 0.95, state: 'normal', color: '#64748B' }
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

    // Register with MasterTicker
    ticker.add('fosafe_3d_haul_road', (delta, elapsed) => {
      this.update(delta, elapsed);
      this.render();
    });
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Cap DPR cleanly to 1.25 for peak performance and sharp rendering
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  onMouseMove(e) {
    this.hasPointerMoved = true;
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    this.mouse.targetX = nx * 32;
    this.mouse.targetY = ny * 20;
  }

  onScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.targetScrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }

  setManualFogDensity(density) {
    this.manualFogOverride = Math.max(0.05, Math.min(1.0, density));
  }

  update(delta, elapsed) {
    // Smooth lerp scroll progress
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Smooth lerp pointer parallax
    if (!this.hasPointerMoved) {
      this.mouse.targetX = Math.sin(elapsed * 0.0006) * 14;
      this.mouse.targetY = Math.cos(elapsed * 0.0005) * 8;
    }
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Progress vehicles along 3D road
    const dt = delta / 16.6;
    this.vehicles[0].progress = (this.vehicles[0].progress + this.truckSpeed * dt) % 1.0;
    this.vehicles[1].progress = (this.vehicles[1].progress + this.truckSpeed * dt * 0.9) % 1.0;
    this.vehicles[2].progress = (this.vehicles[2].progress + 0.00025 * dt) % 1.0;

    // Sensor pulse wave
    this.sensorPulse = (this.sensorPulse + 0.02 * dt) % 1.0;
    this.fogTime += delta * 0.0005;

    // Calculate dynamic fog density from scroll if not manually overridden
    if (this.manualFogOverride !== null) {
      this.fogDensity += (this.manualFogOverride - this.fogDensity) * 0.1;
    } else {
      const sp = this.scrollProgress;
      let targetFog = 0.18;
      if (sp < 0.15) {
        targetFog = 0.16 + (sp / 0.15) * 0.20; // Clear to morning haze
      } else if (sp >= 0.15 && sp < 0.35) {
        const t = (sp - 0.15) / 0.20;
        targetFog = 0.36 + t * 0.52; // Climbs to 0.88 (Station 02: Dense Fog Collapse)
      } else if (sp >= 0.35 && sp < 0.65) {
        const t = (sp - 0.35) / 0.30;
        targetFog = 0.88 - t * 0.38; // 0.50 (Sensor penetration active)
      } else {
        targetFog = 0.50 - (sp - 0.65) * 0.22; // 0.28 (Control room wide view)
      }
      this.fogDensity += (targetFog - this.fogDensity) * 0.06;
    }
  }

  // 3D Perspective Projection: Projects (worldX, worldY, worldZ) -> 2D Screen (x, y)
  project3D(wx, wy, wz) {
    const w = this.width;
    const h = this.height;

    // Dynamic camera pitch & altitude based on scroll progress
    // Station 1: Broad pit view, Station 2-5: Zoom in close to truck bumper, Station 6-10: Fleet overview
    const sp = this.scrollProgress;
    const zoom = 1.0 + Math.sin(Math.min(1.0, sp * 2.2) * Math.PI * 0.5) * 0.35;

    const fov = 680 * zoom;
    const camY = -120 + sp * 80;
    const camZ = 520 - sp * 140;

    const depth = wy + 260;
    if (depth <= 10) return null;

    const scale = fov / depth;
    const isMobile = w < 768;
    const centerX = isMobile ? (w * 0.5 + this.mouse.x) : (w * 0.58 + this.mouse.x);
    const centerY = h * 0.42 + this.mouse.y;

    const screenX = centerX + wx * scale;
    const screenY = centerY + (camY - wz) * scale + (wy * 0.32);

    return { x: screenX, y: screenY, scale };
  }

  // Catmull-Rom interpolation on 3D road waypoints
  getPointOn3DRoad(t) {
    const pts = this.roadSpline3D;
    const n = pts.length - 1;
    const ct = Math.max(0, Math.min(0.999, t));
    const p = ct * n;
    const i = Math.floor(p);
    const u = p - i;

    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[Math.min(n, i + 1)];
    const p3 = pts[Math.min(n, i + 2)];

    const u2 = u * u;
    const u3 = u2 * u;

    const interp = (a0, a1, a2, a3) => {
      return 0.5 * ((2 * a1) +
        (-a0 + a2) * u +
        (2 * a0 - 5 * a1 + 4 * a2 - a3) * u2 +
        (-a0 + 3 * a1 - 3 * a2 + a3) * u3);
    };

    return {
      x: interp(p0.x, p1.x, p2.x, p3.x),
      y: interp(p0.y, p1.y, p2.y, p3.y),
      z: interp(p0.z, p1.z, p2.z, p3.z)
    };
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    if (!ctx || w === 0 || h === 0) return;

    const isLight = this.theme === 'light';

    // 1. Clear background
    ctx.fillStyle = isLight ? '#F8FAFC' : '#07090D';
    ctx.fillRect(0, 0, w, h);

    // 2. Draw 3D Terraced Pit Benches & Contours
    this.draw3DPitBenches(ctx, isLight);

    // 3. Draw 3D Mine Haul Road (Surface, Berms, Dashed Centerlines)
    this.draw3DHaulRoad(ctx, isLight);

    // 4. Draw Vehicles in 3D Perspective (CAT 797F, Scout, Sensors & Beams)
    this.draw3DFleetUnits(ctx, isLight);

    // 5. Draw Atmospheric 3D Depth Fog (Single-pass, high performance)
    this.draw3DDepthFog(ctx, w, h, isLight);

    // 6. Draw Ambient Survey Scale & Grid HUD
    this.drawSurveyHud(ctx, w, h, isLight);
  }

  draw3DPitBenches(ctx, isLight) {
    ctx.save();
    ctx.lineWidth = 1;

    // 4 Terraced Contours along the pit slopes
    const benches = [
      { z: 160, label: 'BENCH 01 // +260m' },
      { z: 110, label: 'BENCH 02 // +220m' },
      { z: 60,  label: 'BENCH 03 // +180m' },
      { z: 15,  label: 'PIT FLOOR // +140m' }
    ];

    benches.forEach(b => {
      ctx.beginPath();
      ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)';
      ctx.setLineDash([4, 6]);

      let first = true;
      for (let x = -280; x <= 280; x += 40) {
        const p = this.project3D(x, 480 + (b.z * 1.8), b.z);
        if (p) {
          if (first) { ctx.moveTo(p.x, p.y); first = false; }
          else ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();

      // Bench label tag on leftmost projected point
      const tagP = this.project3D(-240, 480 + (b.z * 1.8), b.z);
      if (tagP) {
        ctx.font = '8.5px "JetBrains Mono", monospace';
        ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.55)' : 'rgba(148, 163, 184, 0.35)';
        ctx.fillText(b.label, tagP.x + 6, tagP.y - 4);
      }
    });

    ctx.restore();
  }

  draw3DHaulRoad(ctx, isLight) {
    const steps = 48;
    const baseHalfWidth = 26; // meters

    const leftPts = [];
    const rightPts = [];
    const centerPts = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt3d = this.getPointOn3DRoad(t);

      // Tangent vector for road perpendicular width
      const nextPt = this.getPointOn3DRoad(Math.min(1.0, t + 0.02));
      const dx = nextPt.x - pt3d.x;
      const dy = nextPt.y - pt3d.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      const pCenter = this.project3D(pt3d.x, pt3d.y, pt3d.z);
      const pLeft = this.project3D(pt3d.x + nx * baseHalfWidth, pt3d.y + ny * baseHalfWidth, pt3d.z);
      const pRight = this.project3D(pt3d.x - nx * baseHalfWidth, pt3d.y - ny * baseHalfWidth, pt3d.z);

      if (pCenter && pLeft && pRight) {
        centerPts.push(pCenter);
        leftPts.push(pLeft);
        rightPts.push(pRight);
      }
    }

    if (leftPts.length < 2) return;

    ctx.save();

    // 1. Road Bed (Asphalt / Graded Aggregate Surface in 3D)
    ctx.beginPath();
    ctx.moveTo(leftPts[0].x, leftPts[0].y);
    for (let i = 1; i < leftPts.length; i++) {
      ctx.lineTo(leftPts[i].x, leftPts[i].y);
    }
    for (let i = rightPts.length - 1; i >= 0; i--) {
      ctx.lineTo(rightPts[i].x, rightPts[i].y);
    }
    ctx.closePath();

    ctx.fillStyle = isLight ? 'rgba(226, 232, 240, 0.85)' : 'rgba(15, 20, 30, 0.75)';
    ctx.fill();

    // 2. Road Berm Shoulders (3D safety barrier boundary)
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 3. Dashed Centerline with Perspective
    ctx.beginPath();
    ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.7)' : 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    for (let i = 0; i < centerPts.length; i++) {
      if (i === 0) ctx.moveTo(centerPts[i].x, centerPts[i].y);
      else ctx.lineTo(centerPts[i].x, centerPts[i].y);
    }
    ctx.stroke();

    ctx.restore();
  }

  draw3DFleetUnits(ctx, isLight) {
    const truck = this.vehicles[0]; // CAT 797F // D-07
    const scout = this.vehicles[1]; // SCOUT JEEP // S-01

    const truck3D = this.getPointOn3DRoad(truck.progress);
    const scout3D = this.getPointOn3DRoad(scout.progress);

    const ptTruck = this.project3D(truck3D.x, truck3D.y, truck3D.z);
    const ptScout = this.project3D(scout3D.x, scout3D.y, scout3D.z);

    if (!ptTruck || !ptScout) return;

    ctx.save();

    // 1. Distance Proximity Laser Vector between D-07 and S-01
    ctx.beginPath();
    ctx.moveTo(ptTruck.x, ptTruck.y);
    ctx.lineTo(ptScout.x, ptScout.y);
    ctx.strokeStyle = isLight ? 'rgba(220, 38, 38, 0.7)' : 'rgba(239, 68, 68, 0.85)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);
    ctx.stroke();

    // Midpoint Distance Warning Badge
    const midX = (ptTruck.x + ptScout.x) * 0.5;
    const midY = (ptTruck.y + ptScout.y) * 0.5;

    ctx.fillStyle = isLight ? '#FFFFFF' : '#111622';
    ctx.strokeStyle = isLight ? 'rgba(220, 38, 38, 0.6)' : 'rgba(239, 68, 68, 0.7)';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.roundRect(midX - 34, midY - 10, 68, 20, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isLight ? '#DC2626' : '#EF4444';
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('08.4m ALERT', midX, midY);

    // 2. 3D LiDAR / Radar Forward Safety Cone (Piercing forward into fog)
    const coneLen = 55 * ptTruck.scale;
    const coneSpread = 32 * ptTruck.scale;
    ctx.beginPath();
    ctx.moveTo(ptTruck.x, ptTruck.y);
    ctx.lineTo(ptTruck.x + coneSpread, ptTruck.y + coneLen);
    ctx.lineTo(ptTruck.x - coneSpread, ptTruck.y + coneLen);
    ctx.closePath();

    const coneGrad = ctx.createLinearGradient(ptTruck.x, ptTruck.y, ptTruck.x, ptTruck.y + coneLen);
    if (isLight) {
      coneGrad.addColorStop(0, 'rgba(217, 119, 6, 0.25)');
      coneGrad.addColorStop(1, 'rgba(217, 119, 6, 0.0)');
    } else {
      coneGrad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
      coneGrad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
    }
    ctx.fillStyle = coneGrad;
    ctx.fill();

    // 3. Projected 3D Safety Buffer Ellipse on Road Surface
    const bufferRadius = (28 + this.sensorPulse * 6) * ptTruck.scale;
    ctx.beginPath();
    ctx.ellipse(ptTruck.x, ptTruck.y, bufferRadius * 1.4, bufferRadius * 0.65, 0, 0, Math.PI * 2);
    ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.45)' : 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.stroke();

    // 4. Render 3D 400-ton Haul Truck (CAT 797F)
    this.render3DTruckModel(ctx, ptTruck.x, ptTruck.y, ptTruck.scale, isLight);

    // 5. Render Forward Obstacle / Scout Unit (S-01)
    this.render3DScoutModel(ctx, ptScout.x, ptScout.y, ptScout.scale, isLight);

    ctx.restore();
  }

  // Authentic 3D Isometric Haul Truck Model with dump body, cab & dual wheels
  render3DTruckModel(ctx, x, y, scale, isLight) {
    const s = Math.max(0.6, Math.min(1.4, scale * 1.8));

    ctx.save();
    ctx.translate(x, y);

    // Dual Rear Wheels
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(-14 * s, -6 * s, 6 * s, 12 * s);
    ctx.fillRect(8 * s, -6 * s, 6 * s, 12 * s);

    // Front Bumper / Radiator
    ctx.fillStyle = isLight ? '#94A3B8' : '#334155';
    ctx.fillRect(-10 * s, 4 * s, 20 * s, 5 * s);

    // Giant Yellow Dump Body (3D Perspective Facet)
    ctx.fillStyle = '#F59E0B'; // Safety Amber Mining Truck Body
    ctx.beginPath();
    ctx.moveTo(-11 * s, -16 * s);
    ctx.lineTo(11 * s, -16 * s);
    ctx.lineTo(13 * s, 2 * s);
    ctx.lineTo(-13 * s, 2 * s);
    ctx.closePath();
    ctx.fill();

    // 3D Shadow Facet on Top Body
    ctx.fillStyle = '#D97706';
    ctx.fillRect(-9 * s, -14 * s, 18 * s, 12 * s);

    // Operator Cab (Left side of truck, high above ground)
    ctx.fillStyle = isLight ? '#0F172A' : '#1E293B';
    ctx.fillRect(-10 * s, -2 * s, 7 * s, 7 * s);

    // Tinted Windshield
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(-9 * s, 1 * s, 5 * s, 3 * s);

    // Headlights (Twin forward-casting beams)
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(-7 * s, 7 * s, 1.8 * s, 0, Math.PI * 2);
    ctx.arc(7 * s, 7 * s, 1.8 * s, 0, Math.PI * 2);
    ctx.fill();

    // Monospace Unit Identification Tag
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = isLight ? '#0F172A' : '#F8FAFC';
    ctx.fillText('CAT 797F // D-07', 16 * s, -4 * s);

    ctx.font = '400 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? '#64748B' : '#94A3B8';
    ctx.fillText('SPEED: 28 km/h · DESCENDING', 16 * s, 7 * s);

    ctx.restore();
  }

  // 3D Scout Jeep Obstacle Ahead
  render3DScoutModel(ctx, x, y, scale, isLight) {
    const s = Math.max(0.5, Math.min(1.2, scale * 1.5));

    ctx.save();
    ctx.translate(x, y);

    // Red Hazard Chassis
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(-6 * s, -8 * s, 12 * s, 16 * s, 2);
    ctx.fill();

    // Emergency Flashing Beacon on Roof
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();

    // Hazard Identification Tag
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#EF4444';
    ctx.fillText('OBSTACLE // SCOUT S-01', 14 * s, -2 * s);

    ctx.font = '400 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? '#64748B' : '#94A3B8';
    ctx.fillText('UNSEEN IN FOG (DISTANCE: 8.4m)', 14 * s, 8 * s);

    ctx.restore();
  }

  // High-performance single-pass atmospheric 3D depth fog
  draw3DDepthFog(ctx, w, h, isLight) {
    const density = this.fogDensity;
    if (density < 0.05) return;

    ctx.save();

    // Horizon depth fog gradient (dense in distance, fading in immediate foreground)
    const fogGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (isLight) {
      fogGrad.addColorStop(0, `rgba(226, 232, 240, ${density * 0.92})`);
      fogGrad.addColorStop(0.45, `rgba(241, 245, 249, ${density * 0.65})`);
      fogGrad.addColorStop(0.85, `rgba(248, 250, 252, ${density * 0.20})`);
      fogGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      fogGrad.addColorStop(0, `rgba(11, 14, 20, ${density * 0.95})`);
      fogGrad.addColorStop(0.45, `rgba(15, 20, 28, ${density * 0.70})`);
      fogGrad.addColorStop(0.85, `rgba(11, 14, 20, ${density * 0.25})`);
      fogGrad.addColorStop(1, 'rgba(7, 9, 13, 0)');
    }

    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }

  drawSurveyHud(ctx, w, h, isLight) {
    ctx.save();
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.45)' : 'rgba(148, 163, 184, 0.35)';

    // Top-Left Coordinates
    ctx.textAlign = 'left';
    ctx.fillText('3D HAUL ROAD PERSPECTIVE // RAMP 04 (8% GRADE)', 28, 36);

    // Top-Right Pit Bench Tag
    ctx.textAlign = 'right';
    ctx.fillText('SECTOR 04 CENTRAL PIT // SENSORS ACTIVE', w - 28, 36);

    ctx.restore();
  }

  destroy() {
    ticker.remove('fosafe_3d_haul_road');
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('scroll', this.handleScroll);
    if (this.unsubscribeTheme) this.unsubscribeTheme();
  }
}
