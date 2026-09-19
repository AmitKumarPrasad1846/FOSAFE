/**
 * FOSAFE v2 HomePage
 * One Continuous Scene Architecture: A single scroll-driven journey
 * through an open-cast mine haul road as it disappears into fog.
 * Persistent pinned canvas layer transforms across 10 stations.
 */

import { HaulRoadContinuousScene } from '../visualizations/HaulRoadContinuousScene.js';
import { ExplodedVehicleUnit } from '../visualizations/ExplodedVehicleUnit.js';
import { VisibilitySimulator } from '../visualizations/VisibilitySimulator.js';
import { DriverConsolePreview } from '../visualizations/DriverConsolePreview.js';
import { MineControlRoomPreview } from '../visualizations/MineControlRoomPreview.js';
import { SafetyLogicPipeline } from '../visualizations/SafetyLogicPipeline.js';
import { PhysicalDigitalLoop } from '../visualizations/PhysicalDigitalLoop.js';
import { scrollManager } from '../lib/scroll.js';

export class HomePage {
  constructor(container) {
    this.container = container;
    this.activeInstances = [];
    this.sceneInstance = null;
  }

  mount() {
    this.render();
    this.initPinnedScene();
    this.initStationComponents();
    this.bindInteractions();
  }

  unmount() {
    this.activeInstances.forEach(instance => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    });
    this.activeInstances = [];

    if (this.sceneInstance && typeof this.sceneInstance.destroy === 'function') {
      this.sceneInstance.destroy();
      this.sceneInstance = null;
    }
  }

  initPinnedScene() {
    const canvas = this.container.querySelector('#continuous-haul-road-canvas');
    if (canvas) {
      this.sceneInstance = new HaulRoadContinuousScene(canvas);

      // Listen for manual fog adjustments from Section 04 visibility simulator
      window.addEventListener('fosafe:set-fog-density', (e) => {
        if (this.sceneInstance && e.detail && typeof e.detail.density === 'number') {
          this.sceneInstance.setManualFogDensity(e.detail.density);
        }
      });
    }
  }

  initStationComponents() {
    // Station 04: Exploded Vehicle Unit
    const explodedMount = this.container.querySelector('#station-exploded-vehicle-mount');
    if (explodedMount) {
      const explodedUnit = new ExplodedVehicleUnit(explodedMount);
      this.activeInstances.push(explodedUnit);
    }

    // Station 05: Low-Visibility Simulator
    const visMount = this.container.querySelector('#station-vis-simulator-mount');
    if (visMount) {
      const visSim = new VisibilitySimulator(visMount);
      this.activeInstances.push(visSim);
    }

    // Station 06: Driver Safety Console
    const consoleMount = this.container.querySelector('#station-driver-console-mount');
    if (consoleMount) {
      const consolePreview = new DriverConsolePreview(consoleMount);
      this.activeInstances.push(consolePreview);
    }

    // Station 07: Mine Control Room
    const controlMount = this.container.querySelector('#station-control-room-mount');
    if (controlMount) {
      const controlRoom = new MineControlRoomPreview(controlMount);
      this.activeInstances.push(controlRoom);
    }

    // Station 08: Safety Logic Pipeline
    const pipelineMount = this.container.querySelector('#station-pipeline-mount');
    if (pipelineMount) {
      const pipeline = new SafetyLogicPipeline(pipelineMount);
      this.activeInstances.push(pipeline);
    }

    // Station 09: Physical + Digital Loop
    const loopMount = this.container.querySelector('#station-hardware-loop-mount');
    if (loopMount) {
      const loop = new PhysicalDigitalLoop(loopMount);
      this.activeInstances.push(loop);
    }
  }

  bindInteractions() {
    // Hero CTA smooth scroll
    const exploreBtn = this.container.querySelector('#hero-explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('station-02');
        if (target) scrollManager.scrollTo(target, { offset: -30 });
      });
    }
  }

  render() {
    this.container.innerHTML = `
      <!-- PERSISTENT PINNED CANVAS LAYER (TRANSFORMS AS USER SCROLLS) -->
      <div class="scene-pinned-wrapper" aria-hidden="true">
        <canvas id="continuous-haul-road-canvas" class="scene-pinned-canvas"></canvas>
        <div class="scene-vignette"></div>
      </div>

      <!-- CONTINUOUS STORYLINE STATIONS (10 STATIONS ACROSS ONE CONTINUOUS SCENE) -->
      <div class="storyline-container">

        <!-- ===================================================================
             STATION 01: HERO // CLEAR ROAD SURVEY OVERVIEW
             =================================================================== -->
        <section id="station-01" class="station-section" aria-label="FOSAFE System Overview">
          <div class="station-container">
            <div class="station-split-left">
              <div class="station-panel hero-station-panel">
                <div class="station-marker font-mono">
                  <span>STATION 01 // OPERATIONAL SPECIFICATION</span>
                </div>

                <h1 class="hero-headline">
                  FOG-AWARE<br />
                  SAFETY SYSTEM
                </h1>

                <p class="hero-sub-text">
                  Real-time vehicle awareness and fleet intelligence for open-cast mining environments where heavy radiation fog, dust, and steep haulage gradients create extreme collision hazards.
                </p>

                <div class="hero-actions-row">
                  <a href="/platform" data-link class="btn-action-primary">
                    <span>EXPLORE PLATFORM</span>
                    <span>→</span>
                  </a>
                  <button id="hero-explore-btn" class="btn-action-secondary">
                    <span>SCROLL JOURNEY ↓</span>
                  </button>
                </div>

                <!-- Primary Focused Vehicle Instrument Readout Strip -->
                <div class="hero-readout-strip font-mono" role="region" aria-label="Primary Target Telemetry Readout">
                  <div class="hero-readout-col">
                    <span class="col-label">PRIMARY TARGET</span>
                    <div class="col-val">D-07</div>
                    <span class="col-sub">CAT 797F // 400t</span>
                  </div>
                  <div class="hero-readout-col">
                    <span class="col-label">OBSTACLE DISTANCE</span>
                    <div class="col-val" style="color: var(--accent-amber);">08.4 <span class="unit-suffix">m</span></div>
                    <span class="col-sub">CLOSING: +4.2 km/h</span>
                  </div>
                  <div class="hero-readout-col">
                    <span class="col-label">RISK ARBITRATION</span>
                    <div class="col-val" style="color: var(--state-warning); font-size: 0.95rem; margin-top: 4px;">
                      MEDIUM RISK
                    </div>
                    <span class="col-sub">DECEL ADVISORY</span>
                  </div>
                </div>
              </div>

              <!-- Deliberate Right-Side Negative Space to Showcase Live Road Radar Spline -->
              <div class="station-spacer" aria-hidden="true"></div>
            </div>
          </div>
        </section>

        <!-- ===================================================================
             STATION 02: THE PROBLEM // LOW VISIBILITY COLLAPSE
             =================================================================== -->
        <section id="station-02" class="station-section" aria-label="The Mine Haul Road Problem">
          <div class="station-container">
            <div class="station-split-right">
              <div class="station-spacer" aria-hidden="true"></div>

              <div class="station-panel">
                <div class="station-marker font-mono">
                  <span>STATION 02 // PIT MICROCLIMATE HAZARD</span>
                </div>

                <h2>LOW VISIBILITY ON MINE HAUL ROADS</h2>

                <p class="lead-text" style="margin-top: 0.75rem;">
                  In open-cast mining, deep pit excavations trap dense winter radiation fog and airborne particulate dust. Sightlines collapse to under 15 meters.
                </p>

                <p>
                  A loaded 400-ton haul truck descending an 8% gradient requires over 60 meters to stop. When sightlines drop below 15 meters, collisions become physically unavoidable without telemetric assistance.
                </p>

                <!-- Comparison Box: Braking Envelope vs Sight Distance -->
                <div class="problem-comparison-box font-mono">
                  <div class="comparison-card critical">
                    <div class="survey-label" style="color: var(--state-critical);">400T STOPPING DISTANCE</div>
                    <div class="instrument-readout" style="margin-top: 0.35rem;">
                      <span class="instrument-val" style="color: var(--state-critical);">62.4</span>
                      <span class="unit-suffix">m</span>
                    </div>
                    <div class="small-mono" style="margin-top: 0.25rem;">@ 30 km/h on 8% wet ramp</div>
                  </div>

                  <div class="comparison-card">
                    <div class="survey-label" style="color: var(--accent-amber);">DRIVER SIGHTLINE (FOG)</div>
                    <div class="instrument-readout" style="margin-top: 0.35rem;">
                      <span class="instrument-val" style="color: var(--accent-amber);">&lt; 15.0</span>
                      <span class="unit-suffix">m</span>
                    </div>
                    <div class="small-mono" style="margin-top: 0.25rem;">Severe radiation inversion</div>
                  </div>
                </div>

                <div class="small-mono" style="margin-top: var(--sp-4); padding: 0.5rem 0.75rem; background: var(--bg-inset); border: 1px solid var(--line-subtle);">
                  DEFICIT ARBITRATION: Obstacle encountered 47.4 meters inside the unassisted stopping envelope.
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ===================================================================
             STATION 03: THE APPROACH // 4-TIER CLOSED LOOP ARCHITECTURE
             =================================================================== -->
        <section id="station-03" class="station-section" aria-label="The FOSAFE Approach">
          <div class="station-container">
            <div class="station-full">
              <div class="station-marker font-mono">
                <span>STATION 03 // MULTI-TIER PARADIGM</span>
              </div>
              <h2>THE FOSAFE APPROACH</h2>
              <p class="lead-text" style="max-width: 720px; margin-top: 0.5rem;">
                A closed-loop safety architecture designed to eliminate blind collisions through continuous acoustic, optical, and inertial edge fusion.
              </p>

              <!-- Stepped Horizontal Sequence -->
              <div class="approach-sequence-grid">
                <div class="approach-step-card">
                  <div>
                    <div class="step-idx">01 // TIER ONE</div>
                    <div class="step-title">SENSE</div>
                    <p class="step-desc">
                      Edge sensors capture proximity, ambient temperature, relative humidity, spatial position, and vehicle tilt at 100Hz hardware sampling.
                    </p>
                  </div>
                  <div class="small-mono">40kHz Ultrasound · GNSS · 6-Axis IMU</div>
                </div>

                <div class="approach-step-card">
                  <div>
                    <div class="step-idx">02 // TIER TWO</div>
                    <div class="step-title">UNDERSTAND</div>
                    <p class="step-desc">
                      ESP32 dual-core MCU calculates instantaneous time-to-impact, relative closing velocity, and road incline vectors in &lt;15ms.
                    </p>
                  </div>
                  <div class="small-mono">Core 1 Dedicated · Real-time FreeRTOS</div>
                </div>

                <div class="approach-step-card">
                  <div>
                    <div class="step-idx">03 // TIER THREE</div>
                    <div class="step-title">WARN</div>
                    <p class="step-desc">
                      In-cab HUD triggers stepped audio-visual alerts and high-intensity strobe beacons before vehicles enter critical braking zones.
                    </p>
                  </div>
                  <div class="small-mono">Audible Buzzer · High-Candela Strobe</div>
                </div>

                <div class="approach-step-card">
                  <div>
                    <div class="step-idx">04 // TIER FOUR</div>
                    <div class="step-title">MONITOR</div>
                    <p class="step-desc">
                      Continuous MQTT telemetry streams fleet coordinates, fog assist states, and haul road risk metrics to central dispatch operations.
                    </p>
                  </div>
                  <div class="small-mono">868MHz LoRa / LTE Uplink · Pit Map</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ===================================================================
             STATION 04: THE VEHICLE // EXPLODED SENSOR BUS UNIT
             =================================================================== -->
        <section id="station-04" class="station-section" aria-label="Vehicle Unit Architecture">
          <div class="station-container">
            <div class="station-full">
              <div style="margin-bottom: var(--sp-6);">
                <div class="station-marker font-mono">
                  <span>STATION 04 // HARDWARE INTEGRATION</span>
                </div>
                <h2>THE FOSAFE VEHICLE UNIT</h2>
                <p class="lead-text" style="max-width: 820px; margin-top: 0.5rem;">
                  A ruggedized IoT edge computer interfacing industrial sensors via deterministic bus protocols. Hover or select any node below to inspect pinouts, bus timing, and operational roles.
                </p>
              </div>

              <!-- Interactive Exploded Unit Mount -->
              <div id="station-exploded-vehicle-mount"></div>
            </div>
          </div>
        </section>

        <!-- ===================================================================
             STATION 05: LOW-VISIBILITY INTELLIGENCE // ADAPTIVE BUFFERS
             =================================================================== -->
        <section id="station-05" class="station-section" aria-label="Low-Visibility Intelligence">
          <div class="station-container">
            <div class="station-full">
              <div style="margin-bottom: var(--sp-6);">
                <div class="station-marker font-mono">
                  <span>STATION 05 // ATMOSPHERIC ADAPTATION</span>
                </div>
                <h2>LOW-VISIBILITY INTELLIGENCE</h2>
                <p class="lead-text" style="max-width: 820px; margin-top: 0.5rem;">
                  As fog and particulate dust envelope the haul road, FOSAFE dynamically expands its safety perimeter buffer, enforcing wider vehicle separation and graduated speed advisories.
                </p>
              </div>

              <!-- Interactive Visibility Simulator Mount -->
              <div id="station-vis-simulator-mount"></div>
            </div>
          </div>
        </section>

        <!-- ===================================================================
             STATION 06: DRIVER SAFETY CONSOLE // COCKPIT HUD
             =================================================================== -->
        <section id="station-06" class="station-section" aria-label="Driver Safety Console">
          <div class="station-container">
            <div class="station-full">
              <div style="margin-bottom: var(--sp-6);">
                <div class="station-marker font-mono">
                  <span>STATION 06 // IN-CAB INTERFACE</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 1rem;">
                  <h2>DRIVER SAFETY CONSOLE</h2>
                  <span class="provenance-tag sim">PREVIEW // COCKPIT HUD</span>
                </div>
                <p class="lead-text" style="max-width: 820px; margin-top: 0.5rem;">
                  Engineered specifically for heavy vehicle operators. High-contrast instrumentation, 360-degree radar proximity rings, and deterministic collision warnings that eliminate driver guesswork in dense fog.
                </p>
              </div>

              <!-- Driver Console Mount -->
              <div id="station-driver-console-mount"></div>
            </div>
          </div>
        </section>

        <!-- ===================================================================
             STATION 07: MINE CONTROL ROOM // DISPATCH SIMULATION
             =================================================================== -->
        <section id="station-07" class="station-section" aria-label="Mine Fleet Control Room">
          <div class="station-container">
            <div class="station-full">
              <div style="margin-bottom: var(--sp-6);">
                <div class="station-marker font-mono">
                  <span>STATION 07 // CENTRALIZED DISPATCH</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 1rem;">
                  <h2>MINE FLEET CONTROL ROOM</h2>
                  <span class="provenance-tag sim">CONCEPT // DISPATCH SIMULATION</span>
                </div>
                <p class="lead-text" style="max-width: 820px; margin-top: 0.5rem;">
                  Centralized visibility across every haul road bench. Real-time fleet positions, active fog assist flags, and automated risk scoring across the entire open-cast excavation.
                </p>
              </div>

              <!-- Control Room Mount -->
              <div id="station-control-room-mount"></div>
            </div>
          </div>
        </section>

        <!-- ===================================================================
             STATION 08: REAL-TIME SAFETY LOGIC CHAIN
             =================================================================== -->
        <section id="station-08" class="station-section" aria-label="Safety Logic Pipeline">
          <div class="station-container">
            <div class="station-full">
              <div style="margin-bottom: var(--sp-6);">
                <div class="station-marker font-mono">
                  <span>STATION 08 // DETERMINISTIC ARBITRATION</span>
                </div>
                <h2>REAL-TIME SAFETY LOGIC CHAIN</h2>
                <p class="lead-text" style="max-width: 820px; margin-top: 0.5rem;">
                  Every telemetry packet flows through a deterministic signal processing pipeline. Sub-45ms round-trip latency ensures driver intervention warnings occur well within the vehicle stopping envelope.
                </p>
              </div>

              <!-- Safety Logic Pipeline Mount -->
              <div id="station-pipeline-mount"></div>
            </div>
          </div>
        </section>

        <!-- ===================================================================
             STATION 09: PHYSICAL + DIGITAL HARDWARE LOOP
             =================================================================== -->
        <section id="station-09" class="station-section" aria-label="Physical Digital Loop">
          <div class="station-container">
            <div class="station-full">
              <div style="margin-bottom: var(--sp-6);">
                <div class="station-marker font-mono">
                  <span>STATION 09 // HARDWARE-IN-THE-LOOP</span>
                </div>
                <h2>PHYSICAL + DIGITAL INTEGRATION</h2>
                <p class="lead-text" style="max-width: 820px; margin-top: 0.5rem;">
                  FOSAFE bridges tactile in-cab controls directly to cloud telemetry. Press the virtual FOG ASSIST button below to observe hardware interrupt execution, local LED confirmation, and instantaneous dispatch notification.
                </p>
              </div>

              <!-- Hardware Loop Mount -->
              <div id="station-hardware-loop-mount"></div>
            </div>
          </div>
        </section>

        <!-- ===================================================================
             STATION 10: PLATFORM TIERS & FIELD TRIALS COLLABORATION
             =================================================================== -->
        <section id="station-10" class="station-section" aria-label="Platform Tiers and Collaboration">
          <div class="station-container">
            <div class="station-full">
              <div class="station-marker font-mono">
                <span>STATION 10 // PLATFORM ARCHITECTURE &amp; FIELD TRIALS</span>
              </div>
              <h2>OPERATIONAL TIERS &amp; INDUSTRIAL COLLABORATION</h2>
              <p class="lead-text" style="max-width: 840px; margin-top: 0.5rem;">
                FOSAFE divides responsibilities cleanly between localized edge safety, pit-wide fleet supervision, and offline simulation engineering. Factual, restrained development focused on verified field reliability.
              </p>

              <!-- Operational Tiers Grid with Strict Badges -->
              <div class="platform-tiers-grid">
                <div class="tier-card">
                  <div>
                    <div class="tier-card-header">
                      <span class="survey-label">TIER 01 // IN-CAB</span>
                      <span class="provenance-tag live">LIVE HARDWARE</span>
                    </div>
                    <h3 style="margin-bottom: 0.5rem; color: #FFFFFF;">Driver Safety Console</h3>
                    <p style="font-size: 0.88rem; line-height: 1.55;">
                      Autonomous on-vehicle unit operating on local sensor buses even during total wireless radio blackout. Delivers sub-15ms audio-visual collision warnings.
                    </p>
                  </div>
                  <div class="small-mono" style="margin-top: 1rem; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem;">
                    • 100Hz Sensor Sampling &nbsp;• Hard Interrupt Strobes
                  </div>
                </div>

                <div class="tier-card">
                  <div>
                    <div class="tier-card-header">
                      <span class="survey-label">TIER 02 // DISPATCH</span>
                      <span class="provenance-tag sim">SIMULATION</span>
                    </div>
                    <h3 style="margin-bottom: 0.5rem; color: #FFFFFF;">Mine Control Room</h3>
                    <p style="font-size: 0.88rem; line-height: 1.55;">
                      Centralized fleet oversight suite for mine superintendents and safety dispatchers. Live pit contours, automated geofencing, and incident logging.
                    </p>
                  </div>
                  <div class="small-mono" style="margin-top: 1rem; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem;">
                    • Topographical Radar Overlay &nbsp;• Risk Index Aggregation
                  </div>
                </div>

                <div class="tier-card">
                  <div>
                    <div class="tier-card-header">
                      <span class="survey-label">TIER 03 // SANDBOX</span>
                      <span class="provenance-tag sim">SIMULATION</span>
                    </div>
                    <h3 style="margin-bottom: 0.5rem; color: #FFFFFF;">Simulation Testbench</h3>
                    <p style="font-size: 0.88rem; line-height: 1.55;">
                      Strictly separated mathematical engine stress-testing risk arbitration equations against synthetic multi-vehicle congestion and extreme fog density.
                    </p>
                  </div>
                  <div class="small-mono" style="margin-top: 1rem; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem;">
                    • Monte Carlo Haulage Models &nbsp;• Zero Live Data Contamination
                  </div>
                </div>
              </div>

              <!-- Collaboration Engagement Paths -->
              <div class="collab-specs-grid" style="margin-top: var(--sp-6);">
                <div class="collab-spec-box">
                  <div class="survey-label survey-label-amber">MINING OPERATORS</div>
                  <p style="font-size: 0.82rem; margin-top: 0.35rem;">
                    Non-invasive retrofitting framework for 24V haul trucks, water tankers, and light inspection vehicles.
                  </p>
                </div>
                <div class="collab-spec-box">
                  <div class="survey-label survey-label-amber">SAFETY COMPLIANCE</div>
                  <p style="font-size: 0.82rem; margin-top: 0.35rem;">
                    Alignment with DGMS proximity warning mandates and ISO 21815 collision avoidance interfaces.
                  </p>
                </div>
                <div class="collab-spec-box">
                  <div class="survey-label survey-label-amber">TELEMATICS PARTNERS</div>
                  <p style="font-size: 0.82rem; margin-top: 0.35rem;">
                    Open schema supporting MQTT, CAN SAE J1939 bridge modules, and low-latency LoRaWAN packets.
                  </p>
                </div>
                <div class="collab-spec-box">
                  <div class="survey-label survey-label-amber">AUTOMATION RESEARCH</div>
                  <p style="font-size: 0.82rem; margin-top: 0.35rem;">
                    Deterministic safety envelope logic prepared for semi-autonomous and autonomous haulage fleets.
                  </p>
                </div>
              </div>

              <!-- Call to Action Banner -->
              <div class="station-panel" style="margin-top: var(--sp-8); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
                <div>
                  <div class="survey-label" style="color: var(--accent-amber);">COMMENCE EVALUATION</div>
                  <h3 style="font-size: 1.6rem; color: #FFFFFF; margin-top: 0.25rem;">
                    Evaluate FOSAFE for Open-Cast Mine Fleets
                  </h3>
                  <p style="font-size: 0.9rem; margin-top: 0.25rem; max-width: 600px;">
                    Explore technical specifications, operational safety logic, or launch the interactive platform testbench.
                  </p>
                </div>
                <div style="display: flex; gap: 0.75rem; flex-shrink: 0;">
                  <a href="/login" data-link class="btn-action-primary">LAUNCH PLATFORM →</a>
                  <a href="/technology" data-link class="btn-action-secondary">TECHNICAL SPECS</a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    `;
  }
}
