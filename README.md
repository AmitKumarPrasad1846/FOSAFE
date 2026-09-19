# ⚡ FOSAFE — Fog-Aware Safety & Fleet Monitoring System

> **Industrial-grade IoT mine vehicle safety and fleet telemetry platform engineered for deep open-cast mining operations where dense winter radiation fog, fugitive particulate dust, and steep haulage ramps create severe collision hazards for Heavy Earth Moving Machinery (HEMM).**

---

<div align="center">

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel%20Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![GitHub Actions CI](https://img.shields.io/badge/CI%2FCD-GitHub%20Pages-22C55E?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/AmitKumarPrasad1846/FOSAFE/actions)
[![Vite 5](https://img.shields.io/badge/Bundler-Vite%205.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Hardware Architecture](https://img.shields.io/badge/MCU-ESP32%20Dual--Core%20240MHz-E7352C?style=for-the-badge&logo=espressif&logoColor=white)](https://espressif.com/)
[![DGMS Standards](https://img.shields.io/badge/Safety%20Standard-DGMS%20Mandate-F59E0B?style=for-the-badge)](https://dgms.gov.in/)
[![ISO 21815](https://img.shields.io/badge/Compliance-ISO%2021815--2-06B6D4?style=for-the-badge)](https://www.iso.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

### [🚀 Explore Live Platform](https://fosafe.vercel.app/) &nbsp;•&nbsp; [🌐 GitHub Pages Mirror](https://AmitKumarPrasad1846.github.io/FOSAFE/) &nbsp;•&nbsp; [📑 Technical Specs](#-hardware-architecture--sensor-fusion-matrix) &nbsp;•&nbsp; [⚡ Quickstart](#-quickstart--local-development)

</div>

---

## 📑 Table of Contents
- [Executive Overview](#-executive-overview)
- [The Industrial Challenge](#-the-industrial-challenge)
- [Core Engineering Solutions](#-core-engineering-solutions)
- [Interactive System Previews](#-interactive-system-previews)
- [Hardware Architecture & Sensor Fusion](#-hardware-architecture--sensor-fusion-matrix)
- [Software & UI Architecture](#-software--ui-architecture)
- [Repository Structure](#-repository-structure)
- [Quickstart & Local Development](#-quickstart--local-development)
- [Deployment Guide (Vercel & GitHub Pages)](#-deployment-guide)
- [Mining Regulatory Compliance](#-mining-regulatory-compliance)
- [Engineering Road Map](#-engineering-road-map)
- [Authors & License](#-license--acknowledgements)

---

## 🔬 Executive Overview

In large-scale surface and open-cast coal/metalliferous mines, heavy haul trucks (e.g., Caterpillar 797F, Komatsu 930E, BEML BH205E) transport upwards of 400 metric tons per cycle across 8–10% grade haul roads. During winter months and dawn shifts, low pit elevations become natural basins for **dense radiation fog**, trapping diesel exhaust and airborne particulate dust ($PM_{10}$, $PM_{2.5}$). 

When ambient optical visibility drops below **15 meters**, a loaded 400-ton haul truck descending at 30 km/h requires over **60 meters to achieve a full service-brake stop** — making unassisted human operator collision avoidance physically impossible.

**FOSAFE** is an integrated cyber-physical collision warning and fleet telemetry ecosystem designed to satisfy Directorate General of Mines Safety (**DGMS**) guidelines and **ISO 21815** collision avoidance standards. By marrying deterministic on-vehicle edge computing (<15ms response loop) with pit-wide telemetry synchronization, FOSAFE guarantees round-the-clock operational safety and eliminates blind-spot collisions.

---

## ⚠️ The Industrial Challenge

```
+---------------------------------------------------------------------------------------------------+
|                                  THE OPEN-CAST PIT REALITY                                        |
+---------------------------------------------------------------------------------------------------+
|  • Operator Eye Height: 5.5 meters above ground level                                              |
|  • Ground Blind Zone: 14+ meters directly in front of bumper (cannot see light utility vehicles)  |
|  • Haul Road Grade: 8% to 10% sustained downgrade ramps                                           |
|  • Loaded Truck Momentum: 400,000 kg @ 8.3 m/s = 13.8 Megajoules of kinetic energy                 |
|  • Braking Distance: 62 meters on wet haul ramp                                                   |
|  • Atmospheric Inversion: Radiation fog reduces visual sighting to <15 meters                     |
|  ==> CRITICAL DEFICIT: Driver Sight Distance (15m) << Required Stopping Distance (62m)            |
+---------------------------------------------------------------------------------------------------+
```

1. **Massive Blind Spots**: The extreme cab elevation prevents operators from sighting light vehicles (boleros, water tankers, survey jeeps) or ground personnel within a 14-meter perimeter of the radiator grill.
2. **Atmospheric Penetration Loss**: LiDAR and standard optical cameras experience severe signal attenuation and light scatter in thick particulate fog and water vapor.
3. **Pit Radio Blackouts**: Reliance on central cloud servers or flaky pit WiFi for collision warnings introduces 200ms–2000ms latencies. At 35 km/h, a 500ms network lag equates to 5 meters of unmitigated travel toward an obstacle.

---

## 🛡️ Core Engineering Solutions

### 1. Deterministic Local Edge Computing (<15ms)
All critical collision detection, sensor fusion, and proximity evaluations execute **locally on an onboard ESP32-S3 Dual-Core SoC**:
- **Core 1 (Real-Time Safety Engine)**: Runs an uninterrupted, hard real-time sensor polling and distance calculation loop every **10ms**.
- **Core 0 (Telemetry & Communications)**: Manages background MQTT-SN / LoRaWAN transmissions, WebSockets, and GPS NMEA parsing without ever stalling the safety core.

### 2. Multi-Sensor Fusion Matrix
FOSAFE combines complementary physics domains to maintain 100% sensor availability regardless of ambient illumination or atmospheric condition:
- **40kHz Ultrasonic Transducers**: Acoustic wave propagation is physically unaffected by atmospheric fog droplets or dense suspended mine dust.
- **Modulated 38kHz Infrared Berm Array**: Continuous optical edge detection monitoring drainage ditches, soft shoulders, and safety berm crests.
- **High-Rate GNSS (u-blox NEO-6M)**: 10Hz position vectors, pit zone geofencing, and relative inter-vehicle distance computation.
- **6-Axis IMU (MPU6050)**: Continuous dynamic pitch/roll measurement calculating haul road slope grade to adjust stopping distance algorithms in real time.
- **Environmental Chamber (DHT11)**: Real-time temperature and relative humidity tracking for automatic fog-density classification.

### 3. Adaptive Dynamic Stopping Buffers
Safety perimeters are not static; they dynamically expand and contract based on haul road gradient and atmospheric fog density:

$$\text{Safety Buffer} = d_{\text{reaction}}(v) + d_{\text{brake}}(v, \theta) + d_{\text{fog}}(\%RH) + \text{Margin}$$

| Atmospheric Condition | Visibility Index | Perimeter Zone | Stopping Buffer | Dynamic Action |
| :--- | :--- | :--- | :--- | :--- |
| **Clear Day** | $> 100\text{ m}$ | Green Zone | $30\text{ m}$ | Standard convoy interval |
| **Moderate Dust/Haze** | $30 - 80\text{ m}$ | Amber Advisory | $80\text{ m}$ | Speed cap advisory (25 km/h) |
| **Dense Radiation Fog** | $< 15\text{ m}$ | Red Emergency | $150\text{ m}$ | Audio klaxon + Strobe beacon + Retarder interlock |

### 4. Hardware-Interrupt Physical + Digital Safety Loop
A rugged, industrial mushroom **FOG ASSIST** push-button inside the cab routes directly to **GPIO 18** via a hardware debounced interrupt service routine (ISR). Triggering the button instantly:
1. Activates high-candela 360° roof-mounted strobe beacons and an 85dB cab buzzer.
2. Generates an encrypted emergency broadcast beacon across the pit mesh network.
3. Locks vehicle telemetry onto the Central Pit Dispatcher's high-priority emergency queue in $<50\text{ms}$.

---

## 🖥️ Interactive System Previews

The platform includes a comprehensive, browser-based simulation suite built with Vanilla JavaScript and HTML5 Canvas:

| Module | Location | Description |
| :--- | :--- | :--- |
| **In-Cab Driver Console** | `/platform` &rarr; Tab 1 | Real-time 360° radar sweep, dynamic collision threat levels (Normal, Caution, Warning, Critical), directional proximity indicators, and tactile test toggles. |
| **Pit Dispatcher Control Room** | `/platform` &rarr; Tab 2 | 2D haul-road topographic map rendering autonomous vehicle markers (D-07, D-12, L-04, S-01), live speed/load telemetry, and risk-filtered fleet roster. |
| **Fog & Radar Simulator** | `/platform` &rarr; Tab 3 | Interactive testbench comparing human eye visibility against 40kHz ultrasound penetration across Clear, Dense Fog, and Dust Storm conditions. |
| **Braking Physics Calculator** | `/how-it-works` | Dynamic physics calculator estimating stopping distances across customizable speeds (10–50 km/h), ramp grades (-12% to +12%), and road friction factors. |
| **Exploded Vehicle Sensor Bus** | `/technology` | Interactive SVG blueprint exposing sensor placements on a 400-ton haul truck with pinouts and sampling rates. |
| **Safety Signal Pipeline** | `/technology` | 7-stage deterministic signal propagation stepper visualizing data transit from physical sensor trigger to dispatcher acknowledgment. |

---

## 🔌 Hardware Architecture & Sensor Fusion Matrix

```
                      +------------------------------------------+
                      |         FOSAFE ONBOARD UNIT (OBU)         |
                      +------------------------------------------+
                                           |
         +---------------------------------+---------------------------------+
         |                                                                   |
   [SENSOR ARRAY]                                                     [OUTPUT ACTUATORS]
   ├── 4x HC-SR04 Ultrasonic (40kHz Acoustic)                        ├── In-Cab OLED / LCD HUD
   ├── 2x 38kHz Modulated IR Berm Detectors                          ├── Multi-Tone 85dB Buzzer
   ├── 1x u-blox NEO-6M GNSS Module (10Hz)                           ├── High-Intensity Amber Roof Strobe
   ├── 1x MPU6050 6-Axis Gyro/Accelerometer                          └── Solid-State Relay (Brake Interlock)
   ├── 1x DHT11 Humidity & Temp Sensor                                               ▲
   └── 1x Heavy-Duty "FOG ASSIST" Push Button (GPIO 18 ISR)                          │
         │                                                                           │
         ▼                                                                           │
   +---------------------------------------------------------------------------------+
   |                     ESP32-S3 DUAL-CORE MICROCONTROLLER (240MHz)                 |
   |                                                                                 |
   |   [CORE 1: DEDICATED SAFETY ENGINE]       [CORE 0: TELEMETRY & PIT COMMS]       |
   |   • 100Hz Sensor Polling Loop             • LoRaWAN (868/915MHz) Long Range     |
   |   • Multi-Sensor Distance Fusion          • 2.4GHz Wi-Fi / LTE-M Gateway        |
   |   • Gradient-Compensated Braking Math     • MQTT-SN Protocol Engine             |
   |   • Sub-15ms Latency Actuator Trigger     • GNSS Sentence NMEA Parsing          |
   +---------------------------------------------------------------------------------+
```

### Complete Sensor Specifications

| Component | Sensor Modality | Electrical Interface | Sample Rate | Operational Function | Enclosure Spec |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ESP32-S3** | Dual Xtensa 32-bit | SPI / I2C / UART / GPIO | 240 MHz | Main edge computation & safety decision core | Flame-retardant ABS |
| **HC-SR04 / JSN-SR04T** | 40kHz Ultrasonic | Digital Trigger / Echo | 20 Hz | Front/Rear bumper obstacle acoustic ranging | IP67 Waterproof |
| **u-blox NEO-6M** | L1 GNSS / GPS | UART (9600–115200 baud) | 10 Hz | Pit coordinates, haul zone tracking & geofencing | Sealed Dome Antenna |
| **MPU6050** | 3-Axis Accel + 3-Axis Gyro | I2C (400 kHz) | 100 Hz | Haul ramp grade angle & abrupt deceleration | SMT Enclosed |
| **Modulated IR** | 38kHz Optical Beam | Digital GPIO | 50 Hz | Berm proximity & edge drop-off avoidance | Optical Polycarbonate |
| **DHT11 / SHT31** | Capacitive Humidity | 1-Wire Digital | 1 Hz | Pit fog density & atmospheric dew point tracking | Slotted Intake Vent |
| **Emergency Push Button** | Mechanical Contact | GPIO 18 (Hardware ISR) | Instant | Manual panic trigger & strobe flasher | IP66 Heavy Duty |

---

## 💻 Software & UI Architecture

FOSAFE's web platform is built from the ground up for zero-dependency execution, maximum speed, and rock-solid industrial reliability:

- **Build Engine**: [Vite 5](https://vitejs.dev/) with instantaneous Hot Module Replacement (HMR) and optimized rollup bundling.
- **Zero Heavy Frameworks**: Pure Vanilla JavaScript with a custom reactive state store (`src/lib/state.js`) ensuring blistering load times (<500ms) and minimal RAM footprint.
- **Dual-Mode Client Router (`src/lib/router.js`)**:
  - **Clean HTML5 Path Routing**: Used seamlessly on modern cloud platforms like Vercel (`/platform`, `/technology`, etc.).
  - **Automatic Hash Fallback**: Automatically switches to hash routing (`#/platform`) when served from directory-based static hosts like GitHub Pages.
- **Vercel SPA Rewrites (`vercel.json`)**: Preconfigured route rewrites and asset caching headers to eliminate 404s on browser reloads.
- **Industrial Design System**:
  - Modular CSS variables architecture: `tokens.css`, `typography.css`, `base.css`, `components.css`, `layout.css`, `visualizations.css`.
  - Dark-first aesthetic tuned for low-light mine control rooms: deep graphite backgrounds (`#0B0D11`, `#161922`), high-contrast safety amber (`#F59E0B`), hazard crimson (`#EF4444`), and telemetry cyan (`#06B6D4`).
  - Distinctive typography using Google Fonts: **Chivo** (Display/Headings) and **JetBrains Mono** (Instrumentation/Data HUDs).

---

## 📂 Repository Structure

```
FOSAFE_v1/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── src/
│   ├── components/
│   │   ├── Navigation.js           # Industrial header with live fleet heartbeat indicator
│   │   └── Footer.js               # Regulatory disclosure & DGMS/ISO standards footer
│   ├── lib/
│   │   ├── router.js               # Dual-mode router (Clean HTML5 paths & GitHub Pages hash)
│   │   ├── state.js                # Micro-reactive state store
│   │   └── telemetry.js            # Synthetic telemetry models (D-07, D-12, L-04, S-01)
│   ├── pages/
│   │   ├── HomePage.js             # Hero radar showcase, value propositions, key metrics
│   │   ├── TechnologyPage.js       # Dual-Core ESP32 specs, sensor bus & signal pipeline
│   │   ├── HowItWorksPage.js       # Stopping dynamics & interactive braking physics calculator
│   │   ├── PlatformPage.js         # Driver Console, Pit Dispatcher & Fog Simulator tabs
│   │   ├── CollaborationPage.js    # Field trial intake & industrial partnership inquiry
│   │   ├── AboutPage.js            # Mining accident case studies & design axioms
│   │   └── LoginPage.js            # Role-based access portal (Driver / Dispatch / Engineer)
│   ├── styles/
│   │   ├── tokens.css              # Design tokens (colors, gradients, elevation, borders)
│   │   ├── typography.css          # Typography scales (Chivo & JetBrains Mono)
│   │   ├── base.css                # Industrial resets & custom scrollbars
│   │   ├── components.css          # HUD cards, status pills & tactile control buttons
│   │   ├── layout.css              # Grid containers, headers, and footers
│   │   └── visualizations.css      # Radar sweep, cockpit instruments & canvas HUD styles
│   ├── visualizations/
│   │   ├── HeroRadarCanvas.js      # 60FPS topographic haul-road radar canvas
│   │   ├── ExplodedVehicleUnit.js  # Interactive SVG exploded vehicle sensor bus diagram
│   │   ├── VisibilitySimulator.js  # Atmospheric fog penetration comparator
│   │   ├── DriverConsolePreview.js # In-cab HUD sweep & proximity warning testbench
│   │   ├── MineControlRoomPreview.js # Dispatch pit radar map & risk-filtered fleet roster
│   │   ├── SafetyLogicPipeline.js  # 7-stage deterministic signal propagation stepper
│   │   └── PhysicalDigitalLoop.js  # GPIO hardware interrupt push-button alert sequence
│   └── main.js                     # Application entry point
├── index.html                      # HTML5 shell with industrial metadata and typography links
├── vercel.json                     # Vercel Single-Page-App rewrites & immutable asset caching
├── vite.config.js                  # Dynamic base configuration (Vercel '/' vs GitHub Pages './')
├── package.json                    # Project dependencies and npm scripts
└── README.md                       # Comprehensive project documentation
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AmitKumarPrasad1846/FOSAFE.git
cd FOSAFE

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
```

Open your browser and navigate to **`http://localhost:5173/`**.

### Building for Production

```bash
npm run build
```

The optimized static production bundle will be generated in the `dist/` directory.

### Previewing the Production Build Locally

```bash
npm run preview
```

---

## 🌐 Deployment Guide

### Option 1: Vercel (Recommended — 1-Click Live)
This repository includes a native [`vercel.json`](vercel.json) configuration supporting Single Page Application rewrites and asset caching:

1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New... &rarr; Project**.
3. Import the `AmitKumarPrasad1846/FOSAFE` repository.
4. Leave settings at default:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your live production instance will be ready in under 30 seconds!

### Option 2: GitHub Pages
An automated GitHub Actions workflow is provided in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. In your GitHub repository, navigate to **Settings** &rarr; **Pages**.
2. Under **Build and deployment** &rarr; **Source**, select **`GitHub Actions`**.
3. Push any commit to `main`, or trigger the workflow manually under the **Actions** tab.
4. GitHub will build and host your platform at:
   `https://<username>.github.io/FOSAFE/`

---

## ⚖️ Mining Regulatory Compliance

FOSAFE is engineered in strict alignment with heavy earth-moving machinery (HEMM) safety guidelines:

- **DGMS Circular No. 04 of 2013 & Technical Guidance**: Mandatory fitment of Proximity Warning Devices (PWD) on all dumpers, tippers, and excavators operating within open-cast mines.
- **ISO 21815-1 & 21815-2 (2020)**: *Earth-moving machinery — Collision warning and avoidance*. Complies with functional requirements for Zone 1 (Alert), Zone 2 (Warning), and Zone 3 (Intervention).
- **Transient Voltage Suppression**: Built for harsh 24V/12V automotive vehicle electrical systems with reverse-polarity protection, TVS surge clamping, and dual-stage buck regulation ($24\text{V} \rightarrow 5\text{V} \rightarrow 3.3\text{V}$).

---

## 🗺️ Engineering Road Map

- [x] High-performance client-side simulation platform & telemetry HUD.
- [x] Dynamic gradient-compensated stopping distance model.
- [x] Real-time 360° FMCW & 40kHz ultrasonic proximity visualization.
- [x] Multi-cloud deployment support (Vercel + GitHub Pages + Docker static).
- [ ] **Phase 2**: LoRaWAN 868/915MHz direct peer-to-peer V2V mesh protocol implementation.
- [ ] **Phase 3**: Integration with vehicle CAN bus (SAE J1939) for automated retarder brake assist.
- [ ] **Phase 4**: Long-wave infrared (LWIR) thermal camera feed fusion with YOLO-based edge detection.

---

## 👥 License & Acknowledgements

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with engineering precision for **Smart India Hackathon (SIH 2026)** under the **Mining Safety & Intelligent Fleet Logistics** track.
