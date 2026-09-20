/**
 * FOSAFE Mine Road Network Map & Autonomous Fleet Simulation
 * Google Maps / Dispatch Map aesthetic with interconnected mine haul roads,
 * autonomous dumpers/haulers moving along routes, simulating acceleration/deceleration,
 * and automatic collision avoidance alerts in the background.
 *
 * Features:
 * - Google Maps Night / Light aesthetic with distinct haul routes, ramps, and spurs
 * - Mine topography: elevation benches, pit sectors, crusher stations, and hazard zones
 * - Autonomous dumpers with realistic kinematic acceleration/deceleration
 * - Intelligent proximity detection: automatic slowing, distance warning vectors,
 *   and safety envelopes changing green -> amber -> red
 * - Scroll-driven camera navigation focusing on blind curves during hazard stations
 * - Lightweight, silky-smooth 60fps performance via MasterTicker
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

    // Camera view offset & zoom
    this.camera = { x: 0, y: 0, targetX: 0, targetY: 0, zoom: 1.0, targetZoom: 1.0 };
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.hasPointerMoved = false;

    // Scroll & Fog
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.fogDensity = 0.20;
    this.manualFogOverride = null;

    // Pulse animation timer
    this.time = 0;

    // =========================================================================
    // MINE ROAD NETWORK GRAPH (Google Maps style interconnected haul routes)
    // Normalized coordinates (0..1000 x 0..700) mapped to screen space
    // =========================================================================
    this.routes = [
      // Route 0: Main Haul Highway (Ramp 04: Bench 01 down to Pit Floor)
      {
        id: 'RAMP-04-MAIN',
        name: 'MAIN HAUL RAMP 04 (8% GRADE)',
        color: '#F59E0B',
        width: 38,
        points: [
          { x: 120, y: 80 },
          { x: 260, y: 150 },
          { x: 420, y: 220 },
          { x: 620, y: 270 },
          { x: 740, y: 360 }, // Hairpin start
          { x: 680, y: 460 }, // Hairpin apex (Hazard Blind Curve)
          { x: 500, y: 500 },
          { x: 340, y: 570 },
          { x: 220, y: 640 }
        ]
      },
      // Route 1: Crusher Spur (Branches from Highway at Junction J-2)
      {
        id: 'CRUSHER-SPUR',
        name: 'PRIMARY CRUSHER ACCESS SPUR',
        color: '#38BDF8',
        width: 28,
        points: [
          { x: 420, y: 220 }, // Connected to Route 0 Junction
          { x: 540, y: 130 },
          { x: 720, y: 110 },
          { x: 880, y: 130 }
        ]
      },
      // Route 2: Pit Floor Loop & Shovel Loading Bench
      {
        id: 'PIT-FLOOR-LOOP',
        name: 'PIT FLOOR LOADING SECTOR',
        color: '#10B981',
        width: 30,
        points: [
          { x: 220, y: 640 }, // Connected to Route 0 bottom
          { x: 380, y: 660 },
          { x: 560, y: 640 },
          { x: 700, y: 590 },
          { x: 780, y: 500 }
        ]
      },
      // Route 3: Auxiliary Maintenance & Inspection Track
      {
        id: 'SERVICE-TRACK',
        name: 'LIGHT VEHICLE SERVICE ROAD',
        color: '#94A3B8',
        width: 20,
        points: [
          { x: 120, y: 80 },
          { x: 160, y: 260 },
          { x: 240, y: 410 },
          { x: 340, y: 570 }
        ]
      }
    ];

    // =========================================================================
    // MAP POINTS OF INTEREST (Google Maps Style Pins & Labels)
    // =========================================================================
    this.pois = [
      { x: 880, y: 130, label: 'PRIMARY ORE CRUSHER #01', sub: 'CAPACITY: 4,500 t/h' },
      { x: 120, y: 80,  label: 'PIT ENTRY & WEIGHBRIDGE', sub: 'CHECKPOINT ALPHA' },
      { x: 680, y: 460, label: 'HAIRPIN JUNCTION (BLIND CURVE)', sub: 'MAX 15 KM/H · FOG PRONE', isHazard: true },
      { x: 700, y: 590, label: 'LOADING BENCH FLOOR #06', sub: 'EXCAVATOR L-04 ACTIVE' }
    ];

    // =========================================================================
    // AUTONOMOUS FLEET VEHICLES (Simulating kinematics, accel & alerts)
    // =========================================================================
    this.vehicles = [
      {
        id: 'D-07',
        name: 'CAT 797F // D-07',
        type: '400t DUMPER',
        routeIndex: 0,
        progress: 0.35,
        speed: 28, // km/h
        targetSpeed: 30,
        accelState: '+1.2 m/s²',
        state: 'normal', // 'normal' | 'warning' | 'critical'
        iconColor: '#F59E0B',
        size: 16,
        safetyRadius: 28,
        isPrimary: true
      },
      {
        id: 'S-01',
        name: 'SCOUT JEEP S-01',
        type: 'SURVEY PICKUP',
        routeIndex: 0,
        progress: 0.44, // Ahead of D-07 on same route
        speed: 16,
        targetSpeed: 20,
        accelState: '-0.5 m/s²',
        state: 'warning',
        iconColor: '#EF4444',
        size: 11,
        safetyRadius: 20,
        isPrimary: false
      },
      {
        id: 'D-12',
        name: 'KOMATSU 930E',
        type: '360t DUMPER',
        routeIndex: 1, // Crusher spur
        progress: 0.55,
        speed: 24,
        targetSpeed: 26,
        accelState: '+0.8 m/s²',
        state: 'normal',
        iconColor: '#10B981',
        size: 15,
        safetyRadius: 26,
        isPrimary: false
      },
      {
        id: 'D-03',
        name: 'BEML BH205E',
        type: '240t DUMPER',
        routeIndex: 2, // Pit floor loop
        progress: 0.22,
        speed: 22,
        targetSpeed: 24,
        accelState: '+0.4 m/s²',
        state: 'normal',
        iconColor: '#10B981',
        size: 14,
        safetyRadius: 24,
        isPrimary: false
      },
      {
        id: 'W-02',
        name: 'WATER TANKER W-02',
        type: 'DUST CONTROL',
        routeIndex: 3, // Service track
        progress: 0.65,
        speed: 18,
        targetSpeed: 18,
        accelState: '0.0 m/s²',
        state: 'normal',
        iconColor: '#38BDF8',
        size: 13,
        safetyRadius: 22,
        isPrimary: false
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

    // Register with MasterTicker
    ticker.add('fosafe_map_network_scene', (delta, elapsed) => {
      this.update(delta, elapsed);
      this.render();
    });
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // High performance 1x to 1.25x DPR
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  onMouseMove(e) {
    this.hasPointerMoved = true;
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    this.mouse.targetX = nx * 35;
    this.mouse.targetY = ny * 20;
  }

  onScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.targetScrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }

  setManualFogDensity(density) {
    this.manualFogOverride = Math.max(0.05, Math.min(1.0, density));
  }

  // Evaluate point and tangent angle along road route
  getPointOnRoute(route, progress) {
    const pts = route.points;
    const n = pts.length - 1;
    const ct = Math.max(0, Math.min(0.999, progress));
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

    const x = interp(p0.x, p1.x, p2.x, p3.x);
    const y = interp(p0.y, p1.y, p2.y, p3.y);

    // Calculate heading angle
    const deltaU = 0.01;
    const nextU = Math.min(1.0, u + deltaU);
    const nx = interp(p0.x, p1.x, p2.x, p3.x);
    const ny = interp(p0.y, p1.y, p2.y, p3.y);
    const dx = (p2.x - p1.x);
    const dy = (p2.y - p1.y);
    const heading = Math.atan2(dy, dx);

    return { x, y, heading };
  }

  // Transform internal map coordinate (0..1000, 0..700) to current screen view
  mapToScreen(mx, my) {
    const w = this.width;
    const h = this.height;

    // Scale map to cover viewport gracefully
    const mapScale = Math.max(w / 1100, h / 750) * this.camera.zoom;
    const ox = (w - 1000 * mapScale) * 0.5 + this.camera.x + this.mouse.x;
    const oy = (h - 700 * mapScale) * 0.5 + this.camera.y + this.mouse.y;

    return {
      x: ox + mx * mapScale,
      y: oy + my * mapScale,
      scale: mapScale
    };
  }

  update(delta, elapsed) {
    this.time += delta * 0.001;
    const dt = delta / 16.6;

    // Smooth scroll interpolation
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Gentle mouse drift if no pointer
    if (!this.hasPointerMoved) {
      this.mouse.targetX = Math.sin(elapsed * 0.0005) * 16;
      this.mouse.targetY = Math.cos(elapsed * 0.0004) * 10;
    }
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Dynamic Camera Tracking (Scroll-driven focus)
    // Station 1: Full map overview
    // Station 2-4: Zoom in close to Ramp 04 Hairpin Curve where D-07 encounters Scout S-01
    // Station 5+: Smooth overview of the whole mine fleet
    const sp = this.scrollProgress;
    if (sp > 0.12 && sp < 0.45) {
      // Focus on Hairpin Hazard Zone (680, 460)
      this.camera.targetZoom = 1.35;
      this.camera.targetX = -120;
      this.camera.targetY = -80;
    } else {
      this.camera.targetZoom = 1.0;
      this.camera.targetX = 0;
      this.camera.targetY = 0;
    }

    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.06;
    this.camera.x += (this.camera.targetX - this.camera.x) * 0.06;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.06;

    // =========================================================================
    // AUTONOMOUS KINEMATICS & PROXIMITY COLLISION AVOIDANCE SIMULATION
    // =========================================================================
    const d07 = this.vehicles[0];
    const s01 = this.vehicles[1];

    // Calculate progress distance between D-07 and S-01 on Route 0
    let distProgress = s01.progress - d07.progress;
    if (distProgress < 0) distProgress += 1.0;

    // Proximity threshold (~8.4 meters equivalent in map scale)
    const isProximityAlert = distProgress > 0.01 && distProgress < 0.14;

    if (isProximityAlert) {
      // Automatic Deceleration / Emergency Braking
      d07.state = 'critical';
      d07.targetSpeed = 12; // Slows down automatically
      d07.accelState = 'DECEL: -3.8 m/s² [BRAKING]';
      d07.safetyRadius = 38;

      s01.state = 'critical';
      s01.targetSpeed = 16;
      s01.accelState = 'DECEL: -1.2 m/s²';
    } else {
      // Normal Cruising & Acceleration
      d07.state = 'normal';
      d07.targetSpeed = 30;
      d07.accelState = 'ACCEL: +1.8 m/s² [CLEAR]';
      d07.safetyRadius = 26;

      s01.state = 'warning';
      s01.targetSpeed = 22;
      s01.accelState = 'CRUISING: 22 km/h';
    }

    // Update vehicle velocities & movement along road graph
    this.vehicles.forEach(v => {
      // Lerp current speed to target speed
      v.speed += (v.targetSpeed - v.speed) * 0.04;

      // Distance step along route
      const routeStep = (v.speed / 3600) * 0.065 * dt;
      v.progress = (v.progress + routeStep) % 1.0;
    });

    // Atmospheric Fog density calculation
    if (this.manualFogOverride !== null) {
      this.fogDensity += (this.manualFogOverride - this.fogDensity) * 0.1;
    } else {
      let targetFog = 0.18;
      if (sp < 0.15) {
        targetFog = 0.16 + (sp / 0.15) * 0.22;
      } else if (sp >= 0.15 && sp < 0.40) {
        const t = (sp - 0.15) / 0.25;
        targetFog = 0.38 + t * 0.50; // Climbs to 0.88 in Station 02
      } else {
        targetFog = 0.88 - (sp - 0.40) * 0.45; // Relaxes to ~0.35 in control room
      }
      this.fogDensity += (targetFog - this.fogDensity) * 0.06;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    if (!ctx || w === 0 || h === 0) return;

    const isLight = this.theme === 'light';

    // 1. Google Maps Base Map Canvas Fill
    ctx.fillStyle = isLight ? '#F1F5F9' : '#080C14';
    ctx.fillRect(0, 0, w, h);

    // 2. Draw Topographical Bench Terrain Polygons
    this.drawTerrainBenches(ctx, isLight);

    // 3. Draw Road Network (Google Maps Multi-Layer Highway Style)
    this.drawRoadNetwork(ctx, isLight);

    // 4. Draw Hazard Geofence Zones (Blind Hairpin Alert Perimeter)
    this.drawHazardGeofences(ctx, isLight);

    // 5. Draw Autonomous Dumpers, Heading Icons & Acceleration HUDs
    this.drawAutonomousFleet(ctx, isLight);

    // 6. Draw Map Labels & Points of Interest (POIs)
    this.drawMapPOIs(ctx, isLight);

    // 7. Draw Atmospheric Weather Fog Overlay
    this.drawFogOverlay(ctx, w, h, isLight);

    // 8. Draw Google Maps Style Technical Corner HUD
    this.drawMapControlsHUD(ctx, w, h, isLight);
  }

  // Draw Terraced Pit Contours & Terrain Polygons (Google Maps terrain style)
  drawTerrainBenches(ctx, isLight) {
    ctx.save();
    ctx.lineWidth = 1;

    // Bench contour layers
    const contours = [
      { y: 150, label: 'BENCH 01 // +260m', color: isLight ? 'rgba(226, 232, 240, 0.6)' : 'rgba(15, 23, 38, 0.4)' },
      { y: 280, label: 'BENCH 02 // +220m', color: isLight ? 'rgba(219, 228, 238, 0.5)' : 'rgba(13, 20, 33, 0.4)' },
      { y: 440, label: 'BENCH 03 // +180m', color: isLight ? 'rgba(210, 220, 232, 0.4)' : 'rgba(11, 17, 28, 0.4)' },
      { y: 580, label: 'PIT FLOOR // +140m', color: isLight ? 'rgba(203, 213, 225, 0.4)' : 'rgba(9, 14, 24, 0.4)' }
    ];

    contours.forEach(c => {
      const pLeft = this.mapToScreen(0, c.y);
      const pRight = this.mapToScreen(1000, c.y);

      ctx.beginPath();
      ctx.moveTo(pLeft.x, pLeft.y);
      ctx.lineTo(pRight.x, pRight.y);
      ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)';
      ctx.setLineDash([4, 6]);
      ctx.stroke();

      // Bench Elevation Readout
      ctx.font = '8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.45)' : 'rgba(148, 163, 184, 0.35)';
      ctx.fillText(c.label, pLeft.x + 20, pLeft.y - 4);
    });

    ctx.restore();
  }

  // Draw Interconnected Road Network (Google Maps styling: Casing + Inner Surface + Centerline)
  drawRoadNetwork(ctx, isLight) {
    this.routes.forEach(route => {
      const screenPts = route.points.map(pt => this.mapToScreen(pt.x, pt.y));
      if (screenPts.length < 2) return;

      const scale = screenPts[0].scale;
      const roadWidth = route.width * scale;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Layer 1: Road Casing / Border (Dark / Light contrast boundary)
      ctx.beginPath();
      ctx.moveTo(screenPts[0].x, screenPts[0].y);
      for (let i = 1; i < screenPts.length; i++) {
        ctx.lineTo(screenPts[i].x, screenPts[i].y);
      }
      ctx.strokeStyle = isLight ? '#CBD5E1' : '#1E293B';
      ctx.lineWidth = roadWidth + 4 * scale;
      ctx.stroke();

      // Layer 2: Road Surface (Asphalt / Graded Gravel Surface)
      ctx.beginPath();
      ctx.moveTo(screenPts[0].x, screenPts[0].y);
      for (let i = 1; i < screenPts.length; i++) {
        ctx.lineTo(screenPts[i].x, screenPts[i].y);
      }
      ctx.strokeStyle = isLight ? '#FFFFFF' : '#111827';
      ctx.lineWidth = roadWidth;
      ctx.stroke();

      // Layer 3: Dashed Road Centerline (Google Maps Navigation Style)
      ctx.beginPath();
      ctx.moveTo(screenPts[0].x, screenPts[0].y);
      for (let i = 1; i < screenPts.length; i++) {
        ctx.lineTo(screenPts[i].x, screenPts[i].y);
      }
      ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.55)' : 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1.5 * scale;
      ctx.setLineDash([8 * scale, 8 * scale]);
      ctx.stroke();

      ctx.restore();
    });
  }

  // Draw Hazard Geofences (Red/Amber hazard zone around blind hairpin turn)
  drawHazardGeofences(ctx, isLight) {
    const p1 = this.mapToScreen(580, 390);
    const p2 = this.mapToScreen(780, 510);
    const width = p2.x - p1.x;
    const height = p2.y - p1.y;

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isLight ? 'rgba(220, 38, 38, 0.5)' : 'rgba(239, 68, 68, 0.55)';
    ctx.lineWidth = 1.2;

    ctx.fillStyle = isLight ? 'rgba(220, 38, 38, 0.04)' : 'rgba(239, 68, 68, 0.06)';
    ctx.beginPath();
    ctx.roundRect(p1.x, p1.y, width, height, 6);
    ctx.fill();
    ctx.stroke();

    // Hazard Area Label
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? '#DC2626' : '#EF4444';
    ctx.fillText('⚠ GEOFENCE HAZARD: BLIND HAIRPIN JUNCTION', p1.x + 8, p1.y + 14);
    ctx.restore();
  }

  // Draw Autonomous Dumpers moving on the road network
  drawAutonomousFleet(ctx, isLight) {
    // 1. Proximity Collision Alert Vector between D-07 and S-01
    const d07 = this.vehicles[0];
    const s01 = this.vehicles[1];
    const r0 = this.routes[0];

    const posD07Map = this.getPointOnRoute(r0, d07.progress);
    const posS01Map = this.getPointOnRoute(r0, s01.progress);

    const sD07 = this.mapToScreen(posD07Map.x, posD07Map.y);
    const sS01 = this.mapToScreen(posS01Map.x, posS01Map.y);

    const isAlert = d07.state === 'critical';

    ctx.save();

    // Distance laser line connecting the two trucks
    ctx.beginPath();
    ctx.moveTo(sD07.x, sD07.y);
    ctx.lineTo(sS01.x, sS01.y);
    ctx.strokeStyle = isAlert ? '#EF4444' : 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = isAlert ? 2.0 : 1.2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();

    // Floating Proximity Badge
    const midX = (sD07.x + sS01.x) * 0.5;
    const midY = (sD07.y + sS01.y) * 0.5;

    ctx.fillStyle = isLight ? '#FFFFFF' : '#111622';
    ctx.strokeStyle = isAlert ? '#EF4444' : 'var(--accent-amber)';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.roundRect(midX - 44, midY - 11, 88, 22, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isAlert ? '#DC2626' : (isLight ? '#B45309' : '#F59E0B');
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isAlert ? '08.4m [BRAKE!]' : '18.2m [SAFE]', midX, midY);

    ctx.restore();

    // 2. Draw Each Vehicle on Map
    this.vehicles.forEach(v => {
      const route = this.routes[v.routeIndex];
      const posMap = this.getPointOnRoute(route, v.progress);
      const scr = this.mapToScreen(posMap.x, posMap.y);
      const scale = scr.scale;

      ctx.save();
      ctx.translate(scr.x, scr.y);

      // A. Dynamic Safety Buffer Ring (Pulsing green/amber/red)
      const radius = (v.safetyRadius + (v.state === 'critical' ? Math.sin(this.time * 8) * 4 : 0)) * scale;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = v.state === 'critical' ? 'rgba(239, 68, 68, 0.6)' :
                        v.state === 'warning' ? 'rgba(245, 158, 11, 0.45)' :
                        'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();

      // B. Vehicle Body (Google Maps Navigation Arrow / Dumper Icon)
      ctx.rotate(posMap.heading);

      // Vehicle Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.roundRect(-v.size * scale * 0.7, -v.size * scale * 0.5 + 2, v.size * scale * 1.4, v.size * scale, 3);
      ctx.fill();

      // Vehicle Outer Body
      ctx.fillStyle = v.iconColor;
      ctx.beginPath();
      ctx.roundRect(-v.size * scale * 0.7, -v.size * scale * 0.5, v.size * scale * 1.4, v.size * scale, 3);
      ctx.fill();

      // Directional Heading Indicator (White arrow pointing along road)
      ctx.fillStyle = '#080C14';
      ctx.beginPath();
      ctx.moveTo(v.size * scale * 0.6, 0);
      ctx.lineTo(-v.size * scale * 0.2, -v.size * scale * 0.3);
      ctx.lineTo(-v.size * scale * 0.2, v.size * scale * 0.3);
      ctx.closePath();
      ctx.fill();

      // Reset rotation for text tags
      ctx.rotate(-posMap.heading);

      // C. Google Maps Navigation Tooltip / Readout
      ctx.font = '700 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLight ? '#0F172A' : '#F8FAFC';
      ctx.fillText(v.id, 14 * scale, -7 * scale);

      // Acceleration & Speed Readout (Simulating speed & auto-braking)
      ctx.font = '400 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = v.state === 'critical' ? '#EF4444' : (isLight ? '#64748B' : '#94A3B8');
      ctx.fillText(`${v.speed.toFixed(0)} km/h · ${v.accelState}`, 14 * scale, 5 * scale);

      ctx.restore();
    });
  }

  // Draw Map Points of Interest (Crusher, Entry Gate, Hairpin)
  drawMapPOIs(ctx, isLight) {
    this.pois.forEach(poi => {
      const scr = this.mapToScreen(poi.x, poi.y);
      const scale = scr.scale;

      ctx.save();
      ctx.translate(scr.x, scr.y);

      // POI Pin Marker
      ctx.fillStyle = poi.isHazard ? '#EF4444' : (isLight ? '#0284C7' : '#38BDF8');
      ctx.beginPath();
      ctx.arc(0, 0, 4 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isLight ? '#FFFFFF' : '#0B0E14';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // POI Label Card
      ctx.font = '700 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = poi.isHazard ? (isLight ? '#DC2626' : '#EF4444') : (isLight ? '#0F172A' : '#F8FAFC');
      ctx.fillText(poi.label, 8 * scale, -4 * scale);

      ctx.font = '400 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = isLight ? '#64748B' : '#94A3B8';
      ctx.fillText(poi.sub, 8 * scale, 6 * scale);

      ctx.restore();
    });
  }

  // Atmospheric Weather Fog Overlay (Controlled smoothly by scroll)
  drawFogOverlay(ctx, w, h, isLight) {
    const density = this.fogDensity;
    if (density < 0.05) return;

    ctx.save();
    const fogGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (isLight) {
      fogGrad.addColorStop(0, `rgba(241, 245, 249, ${density * 0.85})`);
      fogGrad.addColorStop(0.5, `rgba(226, 232, 240, ${density * 0.60})`);
      fogGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      fogGrad.addColorStop(0, `rgba(8, 12, 20, ${density * 0.90})`);
      fogGrad.addColorStop(0.5, `rgba(11, 16, 26, ${density * 0.65})`);
      fogGrad.addColorStop(1, 'rgba(8, 12, 20, 0)');
    }
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // Google Maps Style Scale & Coordinates HUD
  drawMapControlsHUD(ctx, w, h, isLight) {
    ctx.save();
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.55)' : 'rgba(148, 163, 184, 0.4)';

    // Top-Left Coordinates
    ctx.textAlign = 'left';
    ctx.fillText('LIVE MINE ROAD NETWORK // SECTOR 04 CENTRAL PIT', 28, 36);

    // Top-Right Status
    ctx.textAlign = 'right';
    ctx.fillText('AUTONOMOUS COLLISION ARBITRATION ACTIVE', w - 28, 36);

    // Bottom-Left Scale Bar
    const barX = 28;
    const barY = h - 28;
    const barW = 80;
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(barX, barY);
    ctx.lineTo(barX + barW, barY);
    ctx.moveTo(barX, barY - 4);
    ctx.lineTo(barX, barY + 4);
    ctx.moveTo(barX + barW, barY - 4);
    ctx.lineTo(barX + barW, barY + 4);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillText('100m SCALE', barX + barW + 8, barY + 3);

    ctx.restore();
  }

  destroy() {
    ticker.remove('fosafe_map_network_scene');
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('scroll', this.handleScroll);
    if (this.unsubscribeTheme) this.unsubscribeTheme();
  }
}
