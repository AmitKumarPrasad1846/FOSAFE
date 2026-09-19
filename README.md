# FOSAFE — Fog-Aware Safety & Fleet Monitoring System

> **IoT-based mine vehicle safety and fleet-monitoring platform designed for open-cast mining environments where heavy radiation fog, dust, and steep haulage gradients create extreme collision hazards.**

[![GitHub Pages Deployment](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen?style=flat-square)](https://github.com/)
[![Built with Vite](https://img.shields.io/badge/Vite-5.4-blue?style=flat-square)](https://vitejs.dev/)
[![Hardware Architecture](https://img.shields.io/badge/MCU-ESP32%20Dual--Core%20240MHz-orange?style=flat-square)](https://espressif.com/)
[![Compliance Focus](https://img.shields.io/badge/Standards-DGMS%20%7C%20ISO%2021815-lightgrey?style=flat-square)](https://dgms.gov.in/)

---

## Overview

In open-cast mining, deep pit excavations trap dense winter radiation fog and airborne particulate dust. Operator eye height in a 400-ton haul truck (such as a Caterpillar 797F or Komatsu 930E) is over **5.5 meters above the ground**, creating blind spots extending **14+ meters** directly in front of the bumper.

On steep 8–10% ramp descents, a loaded haul truck requires over **60 meters to stop**. When visibility drops below 15 meters, collisions become physically unavoidable without telemetric assistance.

**FOSAFE** bridges localized edge sensing and pit-wide dispatcher intelligence:
1. **Local Edge Collision Engine**: Deterministic `<15ms` collision calculation loop executing on Core 1 of an onboard ESP32 MCU, independent of pit radio/cloud latency.
2. **Multi-Sensor Fusion**:
   - **u-blox NEO-6M GNSS**: High-sensitivity 10Hz coordinates and pit zone geofencing.
   - **HC-SR04 Ultrasonic**: 40kHz acoustic ranging unaffected by atmospheric water droplets or dense particulate clouds.
   - **Modulated IR Array**: Optical berm proximity and drainage ditch edge detection.
   - **MPU6050 6-Axis IMU**: Dynamic grade pitch/roll monitoring and sudden deceleration analysis.
   - **DHT11 Environmental Sensor**: Contextual cabin and intake temperature/relative humidity monitoring.
3. **Dynamic Stopping Buffers**: Safety perimeter automatically scales from `30m` (Clear) to `80m` (Low Visibility) to `150m` (Dense Fog).
4. **Physical + Digital Loop**: Momentary in-cab **FOG ASSIST** push-button triggers hardware GPIO 18 interrupt, firing local strobe beacons and transmitting emergency hazard flags to central dispatch.

---

## Repository Structure

```
FOSAFE_v1/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Actions build & deployment to GitHub Pages
├── src/
│   ├── components/
│   │   ├── Navigation.js         # Compact industrial header with live heartbeat status
│   │   └── Footer.js             # Technical disclosure & standards reference footer
│   ├── lib/
│   │   ├── router.js             # Client-side router (GitHub Pages hash fallback aware)
│   │   ├── state.js              # Reactive state container for synchronized UI
│   │   └── telemetry.js          # Synthetic open-cast fleet models (D-07, D-12, L-04, S-01)
│   ├── pages/
│   │   ├── HomePage.js           # 10-section cinematic storytelling flow
│   │   ├── TechnologyPage.js     # Dual-core ESP32 & sensor bus timing specs
│   │   ├── HowItWorksPage.js     # Stopping dynamics & interactive physics calculator
│   │   ├── PlatformPage.js       # In-Cab Console, Dispatch Control Room & Simulator tabs
│   │   ├── CollaborationPage.js  # Field trial framework & pilot intake terminal
│   │   ├── AboutPage.js          # Open-cast hazard context & engineering axioms
│   │   └── LoginPage.js          # Industrial access portal for Operator/Dispatch/QA
│   ├── styles/
│   │   ├── tokens.css            # Dark-first graphite/charcoal tokens & status variables
│   │   ├── typography.css        # Display (Chivo) & Instrumentation (JetBrains Mono)
│   │   ├── base.css              # Industrial resets & custom scrollbars
│   │   ├── components.css        # Tactile buttons & blueprint framing
│   │   ├── layout.css            # Header, footer, container grid
│   │   └── visualizations.css    # Canvas, HUD dials, and simulator styles
│   ├── visualizations/
│   │   ├── HeroRadarCanvas.js    # Canvas haul-road topo contours & autonomous vehicle blips
│   │   ├── ExplodedVehicleUnit.js# Interactive SVG exploded IoT sensor bus diagram
│   │   ├── VisibilitySimulator.js# 3-mode atmospheric fog vs radar penetration testbench
│   │   ├── DriverConsolePreview.js# In-cab 360° radar sweep & proximity test buttons
│   │   ├── MineControlRoomPreview.js# Central dispatch radar map & risk-filtered fleet roster
│   │   ├── SafetyLogicPipeline.js# 7-stage deterministic signal propagation stepper
│   │   └── PhysicalDigitalLoop.js# Tactile push button to cloud alert sequence
│   └── main.js                   # Application bootstrapper
├── index.html                    # Semantic HTML5 shell with Google Fonts & meta tags
├── vite.config.js                # Base './' relative pathing for static host compatibility
├── package.json
└── README.md
```

---

## Local Development

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## Production Build

```bash
npm run build
```

Production bundles are generated into the `dist/` directory with relative asset paths for static hosting on GitHub Pages, Netlify, Vercel, or standalone offline field servers.

---

## Automated GitHub Pages Deployment

This repository includes a preconfigured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To enable:
1. Push the code to GitHub (`git push -u origin main`).
2. In your GitHub repository, navigate to **Settings** &rarr; **Pages**.
3. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
4. The workflow will automatically trigger on each push, build the site, and publish it live!

---

## Engineering Standards & Compliance Focus

- **DGMS (Directorate General of Mines Safety)**: Proximity Warning Device (PWD) and collision avoidance mandate alignment for Heavy Earth Moving Machinery (HEMM).
- **ISO 21815**: Earth-moving machinery — Collision warning and avoidance systems.
- **Electrical Conditioning**: 24V vehicle battery transient suppression, reverse-polarity protection, dual-stage buck regulation (24V &rarr; 5V &rarr; 3.3V).
