/**
 * FOSAFE v2 AboutPage
 * Deep domain context: open-cast mining realities, thermal inversion hazards,
 * blind spot physics of ultra-class haulers, and core engineering philosophy.
 * Fully supports Dark and Light modes.
 */

export class AboutPage {
  constructor(container) {
    this.container = container;
  }

  mount() {
    this.render();
  }

  unmount() {}

  render() {
    this.container.innerHTML = `
      <div style="padding: calc(64px + var(--sp-8)) var(--sp-6) var(--sp-20);">
        <div style="max-width: 1320px; margin: 0 auto;">
          <!-- Page Header -->
          <div style="margin-bottom: var(--sp-12); max-width: 860px;">
            <div class="station-marker font-mono">
              <span>MISSION &amp; DOMAIN REALITIES // STATION 06</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4.2rem); font-weight: 800; color: var(--text-primary); text-transform: uppercase;">
              THE HAUL ROAD REALITY
            </h1>
            <p class="lead-text" style="margin-top: 0.75rem;">
              FOSAFE was conceived out of the physical hazards unique to deep open-cast mining pits: extreme vehicular scale, steep haulage gradients, and impenetrable radiation inversion fog.
            </p>
          </div>

          <!-- Section: The Physical Disconnect -->
          <div class="station-panel" style="margin-bottom: var(--sp-8);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">PHYSICAL HAZARD PROFILE</span>
                <h3 style="font-size: 1.6rem; color: var(--text-primary); margin-top: 0.2rem;">THE BLIND SPOT GEOMETRY OF ULTRA-CLASS HAULAGE</h3>
              </div>
              <span class="telemetry-tag critical">CRITICAL SIGHTLINE LIMIT</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-8); align-items: center;">
              <div>
                <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.75rem; text-transform: uppercase;">
                  A Driver 5.5 Meters in the Air
                </h3>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem;">
                  In an ultra-class mining truck like the Caterpillar 797F or Komatsu 930E, the driver's eye level sits over 5.5 meters above the ground. Even in broad daylight, the truck's front bumper blind spot extends 12 to 16 meters directly forward, and 25 meters across the passenger flank.
                </p>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary);">
                  A light inspection pickup or maintenance vehicle parked within this perimeter is completely invisible to the driver. When heavy winter fog or excavator dust rolls across the haul road, these blind zones multiply exponentially.
                </p>
              </div>

              <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-xs); padding: 1.5rem;">
                <div class="survey-label" style="color: var(--accent-amber); margin-bottom: 0.75rem;">HAUL TRUCK VISIBILITY LIMITS (CAT 797F)</div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; font-family: var(--font-mono); font-size: 0.78rem;">
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line-subtle); padding-bottom: 0.5rem;">
                    <span style="color: var(--text-muted);">Cab Operator Eye Height:</span>
                    <strong style="color: var(--text-primary);">5.60 Meters</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line-subtle); padding-bottom: 0.5rem;">
                    <span style="color: var(--text-muted);">Front Bumper Ground Blind Spot:</span>
                    <strong style="color: var(--state-critical);">14.5 Meters Forward</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line-subtle); padding-bottom: 0.5rem;">
                    <span style="color: var(--text-muted);">Left Flank Blind Zone:</span>
                    <strong style="color: var(--accent-amber);">22.0 Meters Lateral</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);">Gross Loaded Vehicle Weight:</span>
                    <strong style="color: var(--text-primary);">623 Metric Tons</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thermal Inversion Explained -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-6); margin-bottom: var(--sp-8);">
            <div class="station-panel">
              <div style="border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                <span class="survey-label">ATMOSPHERIC TRAPPING</span>
                <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--text-primary); margin-top: 0.2rem; text-transform: uppercase;">
                  Winter Radiation Inversion
                </h3>
              </div>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary);">
                Open-cast mine pits act as giant thermal basins. During calm winter nights, dense cold air drains down the haul ramps to the pit floor. When warmer air seals the pit rim from above, exhaust fumes, moisture, and fine coal dust are locked into a stagnant, impenetrable layer of radiation fog that lingers for hours past sunrise.
              </p>
            </div>

            <div class="station-panel">
              <div style="border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                <span class="survey-label">ENGINEERING DISCIPLINE</span>
                <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--text-primary); margin-top: 0.2rem; text-transform: uppercase;">
                  Why FOSAFE Rejects Hype
                </h3>
              </div>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary);">
                Mining lives depend on predictability, not buzzwords. We do not claim our sensors "see through fog with magical AI." We use high-frequency acoustic ultrasound that is physically impervious to water droplets, calibrated 6-DOF inertial measurement, and deterministic braking envelopes tested against gravitational deceleration on steep grades.
              </p>
            </div>
          </div>

          <!-- Core Axioms -->
          <div>
            <h3 style="font-family: var(--font-display); font-size: 1.8rem; color: var(--text-primary); margin-bottom: 1.5rem; text-transform: uppercase;">
              OUR THREE ENGINEERING AXIOMS
            </h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--sp-6);">
              <div class="station-panel">
                <span class="survey-label" style="color: var(--accent-amber);">AXIOM 01</span>
                <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--text-primary); margin: 0.4rem 0; text-transform: uppercase;">
                  Edge Over Cloud
                </h4>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary);">
                  A safety system that halts when cellular or RF reception drops in a deep bench is not a safety system. All collision logic executes locally on Core 1 in &lt;15ms.
                </p>
              </div>

              <div class="station-panel">
                <span class="survey-label" style="color: var(--accent-amber);">AXIOM 02</span>
                <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--text-primary); margin: 0.4rem 0; text-transform: uppercase;">
                  Physical Honesty
                </h4>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary);">
                  We explicitly separate live hardware sensor data from simulated models. Contextual sensors (like the DHT11) are identified accurately without inflated capabilities.
                </p>
              </div>

              <div class="station-panel">
                <span class="survey-label" style="color: var(--accent-amber);">AXIOM 03</span>
                <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--text-primary); margin: 0.4rem 0; text-transform: uppercase;">
                  Operator-Centric Ergonomics
                </h4>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary);">
                  A driver operating a 400t hauler cannot read cluttered dashboards. FOSAFE delivers high-contrast visual cues and tactile controls that require zero cognitive load.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
