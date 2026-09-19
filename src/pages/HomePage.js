/**
 * FOSAFE HomePage
 * 10-Section Cinematic Industrial Storytelling Flow.
 */

import { HeroRadarCanvas } from '../visualizations/HeroRadarCanvas.js';
import { ExplodedVehicleUnit } from '../visualizations/ExplodedVehicleUnit.js';
import { VisibilitySimulator } from '../visualizations/VisibilitySimulator.js';
import { DriverConsolePreview } from '../visualizations/DriverConsolePreview.js';
import { MineControlRoomPreview } from '../visualizations/MineControlRoomPreview.js';
import { SafetyLogicPipeline } from '../visualizations/SafetyLogicPipeline.js';
import { PhysicalDigitalLoop } from '../visualizations/PhysicalDigitalLoop.js';

export class HomePage {
  constructor(container) {
    this.container = container;
    this.activeInstances = [];
  }

  mount() {
    this.render();
    this.initInteractiveComponents();
  }

  unmount() {
    this.activeInstances.forEach(instance => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    });
    this.activeInstances = [];
  }

  initInteractiveComponents() {
    // 1. Hero Radar Canvas
    const canvas = this.container.querySelector('#hero-radar-canvas');
    if (canvas) {
      const heroRadar = new HeroRadarCanvas(canvas);
      this.activeInstances.push(heroRadar);
    }

    // 2. Section 03: Exploded Vehicle Unit
    const explodedContainer = this.container.querySelector('#exploded-vehicle-mount');
    if (explodedContainer) {
      const explodedUnit = new ExplodedVehicleUnit(explodedContainer);
      this.activeInstances.push(explodedUnit);
    }

    // 3. Section 04: Visibility Simulator
    const visSimContainer = this.container.querySelector('#vis-simulator-mount');
    if (visSimContainer) {
      const visSim = new VisibilitySimulator(visSimContainer);
      this.activeInstances.push(visSim);
    }

    // 4. Section 05: Driver Safety Console
    const consoleContainer = this.container.querySelector('#driver-console-mount');
    if (consoleContainer) {
      const consolePreview = new DriverConsolePreview(consoleContainer);
      this.activeInstances.push(consolePreview);
    }

    // 5. Section 06: Mine Control Room
    const controlContainer = this.container.querySelector('#control-room-mount');
    if (controlContainer) {
      const controlRoom = new MineControlRoomPreview(controlContainer);
      this.activeInstances.push(controlRoom);
    }

    // 6. Section 07: Safety Logic Pipeline
    const pipelineContainer = this.container.querySelector('#pipeline-mount');
    if (pipelineContainer) {
      const pipeline = new SafetyLogicPipeline(pipelineContainer);
      this.activeInstances.push(pipeline);
    }

    // 7. Section 08: Physical + Digital Loop
    const loopContainer = this.container.querySelector('#hardware-loop-mount');
    if (loopContainer) {
      const loop = new PhysicalDigitalLoop(loopContainer);
      this.activeInstances.push(loop);
    }
  }

  render() {
    this.container.innerHTML = `
      <!-- HERO SECTION -->
      <section class="hero-wrapper">
        <div class="hero-bg-canvas-container">
          <canvas id="hero-radar-canvas" class="hero-canvas"></canvas>
        </div>
        <div class="hero-overlay-gradient"></div>

        <div class="container" style="position: relative; z-index: 3;">
          <div class="hero-content">
            <div class="section-eyebrow">
              <span class="pulse-dot"></span>
              <span>OPERATIONAL SYSTEM SPECIFICATION</span>
            </div>

            <h1 class="hero-headline">
              <span class="headline-lead">FOG-AWARE</span>
              SAFETY SYSTEM
            </h1>

            <p class="hero-support-text">
              Real-time vehicle awareness and fleet intelligence for open-cast mining environments where heavy fog, dust, and blind gradients create extreme operational hazards.
            </p>

            <div class="hero-cta-group">
              <a href="/platform" data-link class="btn btn-primary btn-lg">
                <span>EXPLORE PLATFORM</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a href="/how-it-works" data-link class="btn btn-secondary btn-lg">
                <span>SAFETY LOGIC</span>
              </a>
            </div>

            <!-- Primary Target Live Readout HUD -->
            <div class="hero-instrument-hud">
              <div>
                <span class="data-label">PRIMARY TARGET</span>
                <div class="val-row" style="margin-top: 4px;">
                  <span class="data-value" style="font-size: 1.3rem; color: #EDEFEF;">D-07</span>
                </div>
                <span class="body-small" style="font-size: 0.72rem; color: var(--text-dim);">CAT 797F // 400t</span>
              </div>
              <div>
                <span class="data-label">OBSTACLE DISTANCE</span>
                <div class="val-row" style="margin-top: 4px;">
                  <span class="data-value" style="font-size: 1.3rem; color: var(--accent-amber);">08.4</span>
                  <span class="unit-label" style="color: var(--accent-amber);">m</span>
                </div>
                <span class="body-small" style="font-size: 0.72rem; color: var(--text-dim);">CLOSING: +4.2 km/h</span>
              </div>
              <div>
                <span class="data-label">RISK ARBITRATION</span>
                <div style="margin-top: 6px;">
                  <span class="telemetry-tag warning" style="font-size: 0.68rem; padding: 2px 6px;">
                    MEDIUM RISK
                  </span>
                </div>
                <span class="body-small" style="font-size: 0.72rem; color: var(--text-dim);">DECEL ADVISORY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 01: THE PROBLEM -->
      <section class="section-wrapper" id="the-problem">
        <div class="container">
          <div class="problem-grid">
            <div>
              <span class="section-eyebrow">STATION 01 // CRITICAL PIT HAZARD</span>
              <h2 class="section-title">LOW VISIBILITY ON MINE HAUL ROADS</h2>
              <p class="body-large" style="margin-bottom: 1rem;">
                In open-cast mining, deep pit excavations trap dense winter radiation fog and airborne particulate dust. Sightlines frequently collapse to under 15 meters.
              </p>
              <p class="body-text" style="margin-bottom: 1.5rem;">
                A 400-ton ultra-class haul truck descending an 8% gradient requires over 60 meters to come to a controlled halt. When heavy fog blinds drivers to oncoming light vehicles, switchback edges, and stationary shovels, catastrophic collisions occur before visual confirmation is possible.
              </p>
              
              <div class="industrial-grid industrial-grid-2" style="margin-top: 1rem;">
                <div class="metric-box">
                  <span class="metric-label">STOPPING DISTANCE AT 30 KM/H</span>
                  <div class="val-row">
                    <span class="metric-value" style="color: var(--status-critical);">62.4</span>
                    <span class="metric-unit">m</span>
                  </div>
                  <span class="body-small">400t GVW on 8% wet ramp</span>
                </div>
                <div class="metric-box">
                  <span class="metric-label">UNASSISTED SIGHTLINE IN DENSE FOG</span>
                  <div class="val-row">
                    <span class="metric-value" style="color: var(--accent-amber);">&lt; 15</span>
                    <span class="metric-unit">m</span>
                  </div>
                  <span class="body-small">Radiation inversion conditions</span>
                </div>
              </div>
            </div>

            <!-- Technical Visualization Box -->
            <div class="problem-visual-box">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="data-label">HAUL CUT SIGHTLINE COLLAPSE SIMULATION</span>
                <span class="telemetry-tag critical"><span class="pulse-dot"></span>CRITICAL DEFICIT</span>
              </div>
              <div class="obscured-road-preview">
                <!-- Pit road lines obscured by fog layer -->
                <svg viewBox="0 0 400 240" width="100%" height="100%" preserveAspectRatio="none">
                  <polygon points="0,240 400,240 280,100 120,100" fill="#141822" />
                  <line x1="200" y1="100" x2="200" y2="240" stroke="#364254" stroke-width="2" stroke-dasharray="6 6" />
                </svg>
                <div class="fog-shroud"></div>
                <!-- Hidden obstacle warning marker -->
                <div class="hidden-obstacle">
                  <span style="font-weight: 800; font-size: 0.85rem;">UNSEEN OBSTACLE</span>
                  <span>14.2 METERS AHEAD</span>
                  <span style="font-size: 0.65rem; color: #EDEFEF; opacity: 0.8;">STOPPING DISTANCE: 62.4m</span>
                </div>
              </div>
              <div style="margin-top: 0.75rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim); text-align: center;">
                BRAKING DEFICIT: Driver encounters obstacle 48 meters INSIDE the physical stopping envelope.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 02: THE FOSAFE APPROACH -->
      <section class="section-wrapper" id="the-approach">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">STATION 02 // MULTI-TIER PARADIGM</span>
            <h2 class="section-title">THE FOSAFE APPROACH</h2>
            <p class="section-lead">
              A closed-loop architecture designed to eliminate blind collisions through continuous acoustic, optical, and inertial edge fusion.
            </p>
          </div>

          <div class="approach-pipeline">
            <div class="approach-card">
              <div class="approach-step-num">01 // TIER ONE</div>
              <h3 class="approach-card-title">SENSE</h3>
              <p class="approach-card-desc">
                Edge sensors capture proximity, ambient temperature, relative humidity, spatial position, and vehicle tilt at 100Hz hardware sampling.
              </p>
            </div>

            <div class="approach-card">
              <div class="approach-step-num">02 // TIER TWO</div>
              <h3 class="approach-card-title">UNDERSTAND</h3>
              <p class="approach-card-desc">
                ESP32 dual-core MCU calculates instantaneous time-to-impact, relative closing velocity, and road incline vectors in &lt;15ms.
              </p>
            </div>

            <div class="approach-card">
              <div class="approach-step-num">03 // TIER THREE</div>
              <h3 class="approach-card-title">WARN</h3>
              <p class="approach-card-desc">
                In-cab HUD triggers stepped audio-visual alerts and high-intensity strobe beacons before vehicles enter critical braking zones.
              </p>
            </div>

            <div class="approach-card">
              <div class="approach-step-num">04 // TIER FOUR</div>
              <h3 class="approach-card-title">MONITOR</h3>
              <p class="approach-card-desc">
                Continuous MQTT telemetry streams fleet coordinates, fog assist states, and haul road risk metrics to central dispatch operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 03: THE VEHICLE (EXPLODED UNIT) -->
      <section class="section-wrapper" id="the-vehicle">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">STATION 03 // HARDWARE INTEGRATION</span>
            <h2 class="section-title">THE FOSAFE VEHICLE UNIT</h2>
            <p class="section-lead">
              A ruggedized IoT edge computer interfacing industrial sensors via deterministic bus protocols. Hover or select a sensor node below to inspect pinouts, bus timing, and operational roles.
            </p>
          </div>

          <!-- Exploded interactive component mount -->
          <div id="exploded-vehicle-mount"></div>
        </div>
      </section>

      <!-- SECTION 04: LOW-VISIBILITY INTELLIGENCE -->
      <section class="section-wrapper" id="visibility-intelligence">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">STATION 04 // ATMOSPHERIC ADAPTATION</span>
            <h2 class="section-title">LOW-VISIBILITY INTELLIGENCE</h2>
            <p class="section-lead">
              As fog and particulate dust envelope the haul road, FOSAFE dynamically expands its safety perimeter buffer, enforcing wider vehicle separation and graduated speed advisories.
            </p>
          </div>

          <!-- Visibility simulator component mount -->
          <div id="vis-simulator-mount"></div>
        </div>
      </section>

      <!-- SECTION 05: DRIVER SAFETY CONSOLE -->
      <section class="section-wrapper" id="driver-console">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-eyebrow">STATION 05 // IN-CAB INTERFACE</span>
            <h2 class="section-title">DRIVER SAFETY CONSOLE</h2>
            <p class="section-lead mx-auto">
              Engineered specifically for heavy vehicle operators. High-contrast instrumentation, 360-degree radar proximity rings, and deterministic collision warnings that eliminate driver guesswork in dense fog.
            </p>
          </div>

          <!-- Driver console preview mount -->
          <div id="driver-console-mount"></div>
        </div>
      </section>

      <!-- SECTION 06: MINE CONTROL ROOM -->
      <section class="section-wrapper" id="control-room">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">STATION 06 // CENTRALIZED DISPATCH</span>
            <h2 class="section-title">MINE FLEET CONTROL ROOM</h2>
            <p class="section-lead">
              Centralized visibility across every haul road bench. Real-time fleet positions, active fog assist flags, and automated risk scoring across the entire open-cast excavation.
            </p>
          </div>

          <!-- Control room component mount -->
          <div id="control-room-mount"></div>
        </div>
      </section>

      <!-- SECTION 07: REAL-TIME SAFETY LOGIC -->
      <section class="section-wrapper" id="safety-logic">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">STATION 07 // DETERMINISTIC ARBITRATION</span>
            <h2 class="section-title">REAL-TIME SAFETY LOGIC CHAIN</h2>
            <p class="section-lead">
              Every data packet flows through a deterministic signal processing pipeline. Sub-50ms round-trip latency ensures driver intervention warnings occur well within the vehicle stopping envelope.
            </p>
          </div>

          <!-- Safety logic component mount -->
          <div id="pipeline-mount"></div>
        </div>
      </section>

      <!-- SECTION 08: PHYSICAL + DIGITAL HARDWARE LOOP -->
      <section class="section-wrapper" id="physical-digital">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">STATION 08 // HARDWARE-IN-THE-LOOP</span>
            <h2 class="section-title">PHYSICAL + DIGITAL INTEGRATION</h2>
            <p class="section-lead">
              FOSAFE bridges tactile in-cab controls directly to cloud telemetry. Press the virtual FOG ASSIST button below to observe hardware interrupt execution, local LED confirmation, and instantaneous dispatch notification.
            </p>
          </div>

          <!-- Hardware loop component mount -->
          <div id="hardware-loop-mount"></div>
        </div>
      </section>

      <!-- SECTION 09: PLATFORM ARCHITECTURE TIERS -->
      <section class="section-wrapper" id="platform-tiers">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">STATION 09 // SYSTEM BREAKDOWN</span>
            <h2 class="section-title">THREE OPERATIONAL TIERS</h2>
            <p class="section-lead">
              FOSAFE divides responsibilities cleanly between localized edge safety, pit-wide fleet supervision, and offline simulation engineering.
            </p>
          </div>

          <div class="industrial-grid industrial-grid-3">
            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">TIER 01 // IN-CAB</span>
                <span class="telemetry-tag normal">LOCAL EDGE</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.3rem; margin-bottom: 0.5rem; color: #EDEFEF;">
                Driver Safety Console
              </h3>
              <p style="font-size: 0.88rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 1rem;">
                Rugged vehicle cab terminal. Operates autonomously on local sensor buses even during total wireless radio blackout. Delivers instant audio-visual collision warnings.
              </p>
              <div class="footer-links">
                <span class="mono-readout" style="font-size: 0.75rem; color: var(--steel-300);">• Sub-15ms acoustic ranging</span>
                <span class="mono-readout" style="font-size: 0.75rem; color: var(--steel-300);">• High-contrast night/day HUD</span>
                <span class="mono-readout" style="font-size: 0.75rem; color: var(--steel-300);">• Tactile Fog Assist switch</span>
              </div>
            </div>

            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">TIER 02 // DISPATCH</span>
                <span class="telemetry-tag warning">TELEMATICS</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.3rem; margin-bottom: 0.5rem; color: #EDEFEF;">
                Mine Control Room
              </h3>
              <p style="font-size: 0.88rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 1rem;">
                Centralized fleet oversight suite for mine superintendents and safety dispatchers. Live pit contours, automated geofencing, and historical incident playback.
              </p>
              <div class="footer-links">
                <span class="mono-readout" style="font-size: 0.75rem; color: var(--steel-300);">• Topographical radar overlay</span>
                <span class="mono-readout" style="font-size: 0.75rem; color: var(--steel-300);">• Haul road risk index aggregation</span>
                <span class="mono-readout" style="font-size: 0.75rem; color: var(--steel-300);">• Automatic incident event logging</span>
              </div>
            </div>

            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">TIER 03 // SANDBOX</span>
                <span class="telemetry-tag simulated">SYNTHETIC</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.3rem; margin-bottom: 0.5rem; color: #EDEFEF;">
                Simulation Testbench
              </h3>
              <p style="font-size: 0.88rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 1rem;">
                Strictly separated mathematical simulation engine. Stress-tests risk arbitration equations against synthetic multi-vehicle congestion and extreme fog density.
              </p>
              <div class="footer-links">
                <span class="mono-readout" style="font-size: 0.75rem; color: #93C5FD;">• Synthetic hauler kinematics</span>
                <span class="mono-readout" style="font-size: 0.75rem; color: #93C5FD;">• Strict non-live data watermark</span>
                <span class="mono-readout" style="font-size: 0.75rem; color: #93C5FD;">• Safety algorithm QA regression</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 10: COLLABORATION & FIELD TRIALS -->
      <section class="section-wrapper" id="collaboration">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">STATION 10 // TECHNOLOGY ADOPTION</span>
            <h2 class="section-title">INDUSTRIAL ENGAGEMENT &amp; TRIALS</h2>
            <p class="section-lead">
              FOSAFE is engineered to integrate alongside existing mining Fleet Management Systems (FMS) and CAN bus infrastructures. Factual, restrained development focused on verified field reliability.
            </p>
          </div>

          <div class="industrial-grid industrial-grid-4">
            <div class="metric-box">
              <span class="data-label" style="color: var(--accent-amber);">MINING OPERATORS</span>
              <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.5rem;">
                Field trial architecture designed for non-invasive retrofitting on heavy haul trucks, water tankers, and light inspection vehicles.
              </p>
            </div>

            <div class="metric-box">
              <span class="data-label" style="color: var(--accent-amber);">SAFETY COMPLIANCE</span>
              <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.5rem;">
                Alignment with DGMS proximity warning mandates and ISO 21815 collision avoidance interfaces for earthmoving equipment.
              </p>
            </div>

            <div class="metric-box">
              <span class="data-label" style="color: var(--accent-amber);">TELEMATICS PARTNERS</span>
              <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.5rem;">
                Open telemetry schema supporting MQTT, CAN SAE J1939 bridge modules, and low-latency industrial LoRa / 868MHz packet structures.
              </p>
            </div>

            <div class="metric-box">
              <span class="data-label" style="color: var(--accent-amber);">AUTOMATION RESEARCH</span>
              <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary); margin-top: 0.5rem;">
                Shared safety envelope logic ready for future transition into semi-autonomous and autonomous haulage dispatch ecosystems.
              </p>
            </div>
          </div>

          <!-- Call to action block -->
          <div style="margin-top: 3rem; background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: var(--space-8); display: flex; flex-direction: column; md:flex-row; justify-content: space-between; align-items: center; gap: 1.5rem;">
            <div>
              <div class="section-eyebrow" style="margin-bottom: 0.35rem;">ENTER THE PLATFORM</div>
              <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: #EDEFEF;">
                Evaluate FOSAFE for your open-cast haulage fleet
              </h3>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">
                Explore the technical architecture, operational safety logic, or launch the interactive platform simulator.
              </p>
            </div>
            <div style="display: flex; gap: 0.75rem; flex-shrink: 0;">
              <a href="/login" data-link class="btn btn-primary btn-md">LAUNCH PLATFORM</a>
              <a href="/technology" data-link class="btn btn-secondary btn-md">TECHNICAL SPECS</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
