/**
 * FOSAFE v2 HomePage
 * One Continuous Scene Architecture: A single scroll-driven journey
 * through an open-cast mine haul road as it transitions from clear visibility into fog.
 * Persistent pinned canvas layer transforms across 10 concise stations.
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

      // Listen for manual fog adjustments from Section 05 visibility simulator
      window.addEventListener('fosafe:set-fog-density', (e) => {
        if (this.sceneInstance && e.detail && typeof e.detail.density === 'number') {
          this.sceneInstance.setManualFogDensity(e.detail.density);
        }
      });
    }
  }

  initStationComponents() {
    const explodedMount = this.container.querySelector('#station-exploded-vehicle-mount');
    if (explodedMount) {
      const explodedUnit = new ExplodedVehicleUnit(explodedMount);
      this.activeInstances.push(explodedUnit);
    }

    const visMount = this.container.querySelector('#station-vis-simulator-mount');
    if (visMount) {
      const visSim = new VisibilitySimulator(visMount);
      this.activeInstances.push(visSim);
    }

    const consoleMount = this.container.querySelector('#station-driver-console-mount');
    if (consoleMount) {
      const consolePreview = new DriverConsolePreview(consoleMount);
      this.activeInstances.push(consolePreview);
    }

    const controlMount = this.container.querySelector('#station-control-room-mount');
    if (controlMount) {
      const controlRoom = new MineControlRoomPreview(controlMount);
      this.activeInstances.push(controlRoom);
    }

    const pipelineMount = this.container.querySelector('#station-pipeline-mount');
    if (pipelineMount) {
      const pipeline = new SafetyLogicPipeline(pipelineMount);
      this.activeInstances.push(pipeline);
    }

    const loopMount = this.container.querySelector('#station-hardware-loop-mount');
    if (loopMount) {
      const loop = new PhysicalDigitalLoop(loopMount);
      this.activeInstances.push(loop);
    }
  }

  bindInteractions() {
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
      <!-- PERSISTENT PINNED CANVAS LAYER -->
      <div class="scene-pinned-wrapper" aria-hidden="true">
        <canvas id="continuous-haul-road-canvas" class="scene-pinned-canvas"></canvas>
        <div class="scene-vignette"></div>
      </div>

      <!-- CONTINUOUS STORYLINE STATIONS (10 PRECISE STATIONS) -->
      <div class="storyline-container">

        <!-- ===================================================================
             STATION 01: HERO // CLEAR ROAD SURVEY OVERVIEW
             =================================================================== -->
        <section id="station-01" class="station-section" aria-label="FOSAFE System Overview">
          <div class="station-container">
            <div class="station-split-left">
              <div class="station-panel hero-station-panel">
                <div class="station-marker font-mono">
                  <span>STATION 01 // OVERVIEW</span>
                </div>

                <h1 class="hero-headline">
                  FOG-AWARE<br />SAFETY SYSTEM
                </h1>

                <p class="hero-sub-text">
                  Real-time vehicle awareness and collision avoidance for open-cast haul roads under low visibility.
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

                <!-- Primary Vehicle Readout Strip -->
                <div class="hero-readout-strip font-mono" role="region" aria-label="Target Telemetry Readout">
                  <div class="hero-readout-col">
                    <span class="col-label">PRIMARY UNIT</span>
                    <div class="col-val">D-07</div>
                    <span class="col-sub">CAT 797F // 400t</span>
                  </div>
                  <div class="hero-readout-col">
                    <span class="col-label">HAZARD DISTANCE</span>
                    <div class="col-val" style="color: var(--accent-amber);">08.4 <span class="unit-suffix">m</span></div>
                    <span class="col-sub">CLOSING: +4.2 km/h</span>
                  </div>
                  <div class="hero-readout-col">
                    <span class="col-label">ARBITRATION</span>
                    <div class="col-val" style="color: var(--state-warning); font-size: 0.95rem; margin-top: 4px;">
                      MEDIUM RISK
                    </div>
                    <span class="col-sub">DECEL ADVISORY</span>
                  </div>
                </div>
              </div>

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
                  <span>STATION 02 // PIT HAZARDS</span>
                </div>

                <h2>Low Visibility on Haul Roads</h2>

                <p class="lead-text" style="margin-top: 0.5rem;">
                  Deep open-cast pits trap dense winter radiation fog and dust, cutting driver sightlines to under 15 meters.
                </p>

                <p>
                  A loaded 400t hauler descending an 8% grade requires over 60 meters to stop. When sightlines collapse, collisions become physically unavoidable without telemetric assistance.
                </p>

                <!-- Comparison Box: Braking vs Sight Distance -->
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

                <div class="small-mono" style="margin-top: var(--sp-4); padding: 0.65rem 1rem; background: var(--bg-inset); border: 1px solid var(--line-subtle); border-radius: var(--radius-md);">
                  DEFICIT ARBITRATION: Obstacle encountered 47.4m inside the unassisted stopping envelope.
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
                <span>STATION 03 // SYSTEM ARCHITECTURE</span>
              </div>
              <h2>The 4-Tier Safety Framework</h2>
              <p class="lead-text" style="max-width: 680px; margin-top: 0.4rem;">
                Deterministic closed-loop safety architecture from multi-sensor detection to dispatch coordination.
              </p>

              <!-- Stepped Horizontal Sequence -->
              <div class="approach-sequence-grid">
                <div class="approach-step-card">
                  <div>
                    <div class="step-idx">01 // TIER ONE</div>
                    <div class="step-title">SENSE</div>
                    <p class="step-desc">
                      Acoustic ultrasound, GNSS coordinates, and 6-axis IMU sampled at 100Hz hardware interrupts.
                    </p>
                  </div>
                  <div class="small-mono">40kHz Sonar · GNSS · 6-Axis IMU</div>
                </div>

                <div class="approach-step-card">
                  <div>
                    <div class="step-idx">02 // TIER TWO</div>
                    <div class="step-title">UNDERSTAND</div>
                    <p class="step-desc">
                      Dual-core ESP32 computes closing velocity, ramp slope, and time-to-impact in &lt;15ms.
                    </p>
                  </div>
                  <div class="small-mono">Core 1 Dedicated · Real-time FreeRTOS</div>
                </div>

                <div class="approach-step-card">
                  <div>
                    <div class="step-idx">03 // TIER THREE</div>
                    <div class="step-title">WARN</div>
                    <p class="step-desc">
                      In-cab HUD triggers graduated audio-visual alerts and high-intensity strobe beacons.
                    </p>
                  </div>
                  <div class="small-mono">Audible Buzzer · High-Candela Strobe</div>
                </div>

                <div class="approach-step-card">
                  <div>
                    <div class="step-idx">04 // TIER FOUR</div>
                    <div class="step-title">MONITOR</div>
                    <p class="step-desc">
                      Continuous MQTT telemetry streams vehicle states and hazard maps to central dispatch.
                    </p>
                  </div>
                  <div class="small-mono">868MHz Mesh / LTE · Central Map</div>
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
                  <span>STATION 04 // HARDWARE UNIT</span>
                </div>
                <h2>Vehicle Edge Unit (OBU)</h2>
                <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                  Ruggedized IoT edge computer interfacing industrial sensors via deterministic bus protocols.
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
                  <span>STATION 05 // FOG ADAPTATION</span>
                </div>
                <h2>Adaptive Fog Intelligence</h2>
                <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                  FOSAFE dynamically widens vehicle safety buffers and issues deceleration alerts as visibility decreases.
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
                  <span>STATION 06 // CAB TERMINAL</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 1rem;">
                  <h2>Driver Safety Console</h2>
                  <span class="provenance-tag live">IN-CAB HUD</span>
                </div>
                <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                  360° radar proximity HUD delivering high-contrast collision warnings with zero cognitive clutter.
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
                  <span>STATION 07 // DISPATCH CONTROL</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 1rem;">
                  <h2>Mine Fleet Control Room</h2>
                  <span class="provenance-tag sim">DISPATCH CONSOLE</span>
                </div>
                <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                  Centralized radar map tracking haul units, active fog assist states, and bench risk indices.
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
                  <span>STATION 08 // LOGIC PIPELINE</span>
                </div>
                <h2>Real-Time Safety Logic Chain</h2>
                <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                  Sub-45ms round-trip latency guarantees timely intervention warnings well before physical contact.
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
                  <span>STATION 09 // HARDWARE LOOP</span>
                </div>
                <h2>Hardware-in-the-Loop Integration</h2>
                <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                  Press the Fog Assist button below to trigger local GPIO interrupts and real-time dispatch alerts.
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
                <span>STATION 10 // FIELD TRIALS</span>
              </div>
              <h2>Operational Tiers &amp; Field Trials</h2>
              <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                Rigorous separation between on-vehicle edge safety, central dispatch, and offline simulation.
              </p>

              <!-- Operational Tiers Grid -->
              <div class="platform-tiers-grid">
                <div class="tier-card">
                  <div>
                    <div class="tier-card-header">
                      <span class="survey-label">TIER 01 // IN-CAB</span>
                      <span class="provenance-tag live">LIVE HARDWARE</span>
                    </div>
                    <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">Driver Safety Console</h3>
                    <p style="font-size: 0.85rem; line-height: 1.55;">
                      Autonomous on-vehicle unit functioning during total radio loss. Delivers sub-15ms collision warnings.
                    </p>
                  </div>
                  <div class="small-mono" style="margin-top: 0.75rem; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem;">
                    • 100Hz Sensor Sampling · Fast ISR Strobes
                  </div>
                </div>

                <div class="tier-card">
                  <div>
                    <div class="tier-card-header">
                      <span class="survey-label">TIER 02 // DISPATCH</span>
                      <span class="provenance-tag sim">SIMULATION</span>
                    </div>
                    <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">Mine Control Room</h3>
                    <p style="font-size: 0.85rem; line-height: 1.55;">
                      Fleet oversight suite for superintendents. Live pit contours, geofencing, and automated incident logs.
                    </p>
                  </div>
                  <div class="small-mono" style="margin-top: 0.75rem; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem;">
                    • Topographical Radar · Risk Index Tracking
                  </div>
                </div>

                <div class="tier-card">
                  <div>
                    <div class="tier-card-header">
                      <span class="survey-label">TIER 03 // SANDBOX</span>
                      <span class="provenance-tag sim">SIMULATION</span>
                    </div>
                    <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">Simulation Testbench</h3>
                    <p style="font-size: 0.85rem; line-height: 1.55;">
                      Offline mathematical engine stress-testing arbitration logic in synthetic dense fog scenarios.
                    </p>
                  </div>
                  <div class="small-mono" style="margin-top: 0.75rem; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem;">
                    • Monte Carlo Haul Models · Zero Data Leakage
                  </div>
                </div>
              </div>

              <!-- Collaboration Engagement Paths -->
              <div class="collab-specs-grid" style="margin-top: var(--sp-6);">
                <div class="collab-spec-box">
                  <div class="survey-label survey-label-amber">MINING OPERATORS</div>
                  <p style="font-size: 0.82rem; margin-top: 0.35rem; margin-bottom: 0;">
                    Non-invasive 24V retrofits for haul trucks and light inspection pickups.
                  </p>
                </div>
                <div class="collab-spec-box">
                  <div class="survey-label survey-label-amber">SAFETY COMPLIANCE</div>
                  <p style="font-size: 0.82rem; margin-top: 0.35rem; margin-bottom: 0;">
                    Aligned with DGMS proximity circulars and ISO 21815 collision frameworks.
                  </p>
                </div>
                <div class="collab-spec-box">
                  <div class="survey-label survey-label-amber">TELEMATICS INTEGRATION</div>
                  <p style="font-size: 0.82rem; margin-top: 0.35rem; margin-bottom: 0;">
                    Open MQTT broker feeds, CAN SAE J1939 gateways, and 868MHz mesh.
                  </p>
                </div>
                <div class="collab-spec-box">
                  <div class="survey-label survey-label-amber">AUTONOMOUS FLEETS</div>
                  <p style="font-size: 0.82rem; margin-top: 0.35rem; margin-bottom: 0;">
                    Deterministic envelope logic ready for semi-autonomous haulage units.
                  </p>
                </div>
              </div>

              <!-- Call to Action Banner -->
              <div class="station-panel" style="margin-top: var(--sp-8); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
                <div>
                  <div class="survey-label" style="color: var(--accent-amber);">SYSTEM ACCESS</div>
                  <h3 style="font-size: 1.5rem; color: var(--text-primary); margin-top: 0.25rem;">
                    Ready to evaluate FOSAFE?
                  </h3>
                  <p style="font-size: 0.88rem; margin-top: 0.25rem; margin-bottom: 0; max-width: 540px;">
                    Review vehicle hardware specs or launch the interactive terminal preview.
                  </p>
                </div>
                <div style="display: flex; gap: 0.75rem; flex-shrink: 0; flex-wrap: wrap;">
                  <a href="/login" data-link class="btn-action-primary">LAUNCH PLATFORM →</a>
                  <a href="/technology" data-link class="btn-action-secondary">HARDWARE SPECS</a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    `;
  }
}
