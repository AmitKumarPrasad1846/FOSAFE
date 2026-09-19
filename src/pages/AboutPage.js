/**
 * FOSAFE AboutPage
 * Deep domain context: open-cast mining realities, thermal inversion hazards,
 * blind spot physics of ultra-class haulers, and core engineering philosophy.
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
      <div style="padding: var(--space-12) 0 var(--space-20);">
        <div class="container">
          <!-- Page Header -->
          <div style="margin-bottom: var(--space-12);">
            <div class="section-eyebrow">
              <span class="pulse-dot"></span>
              <span>MISSION &amp; DOMAIN REALITIES</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #EDEFEF; text-transform: uppercase;">
              THE HAUL ROAD REALITY
            </h1>
            <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 780px; margin-top: 0.75rem; line-height: 1.6;">
              FOSAFE was conceived out of the physical hazards unique to deep open-cast mining pits: extreme vehicular scale, steep haulage gradients, and impenetrable radiation inversion fog.
            </p>
          </div>

          <!-- Section: The Physical Disconnect -->
          <div class="tech-panel" style="margin-bottom: var(--space-12);">
            <div class="tech-header">
              <span class="tech-title">THE BLIND SPOT GEOMETRY OF ULTRA-CLASS HAULAGE</span>
              <span class="telemetry-tag critical">PHYSICAL HAZARD</span>
            </div>

            <div class="industrial-grid industrial-grid-2" style="margin-top: 1rem; align-items: center;">
              <div>
                <h3 style="font-family: var(--font-display); font-size: 1.3rem; color: #EDEFEF; margin-bottom: 0.75rem;">
                  A Driver 5.5 Meters in the Air
                </h3>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem;">
                  In an ultra-class mining truck like the Caterpillar 797F or Komatsu 930E, the driver's eye level sits over 5.5 meters above the ground. Even in broad daylight, the truck's front bumper blind spot extends 12 to 16 meters directly forward, and 25 meters across the passenger flank.
                </p>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary);">
                  A light inspection pickup or maintenance vehicle parked within this perimeter is completely invisible to the driver. When heavy winter fog or excavator dust rolls across the haul road, these blind zones multiply exponentially.
                </p>
              </div>

              <div style="background: #090B0F; border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 1.25rem;">
                <div class="data-label" style="color: var(--accent-amber); margin-bottom: 0.75rem;">HAUL TRUCK VISIBILITY LIMITS (CAT 797F)</div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; font-family: var(--font-mono); font-size: 0.75rem;">
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                    <span style="color: var(--text-muted);">Cab Operator Eye Height:</span>
                    <strong style="color: #EDEFEF;">5.60 Meters</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                    <span style="color: var(--text-muted);">Front Bumper Ground Blind Spot:</span>
                    <strong style="color: var(--status-critical);">14.5 Meters Forward</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;">
                    <span style="color: var(--text-muted);">Left Flank Blind Zone:</span>
                    <strong style="color: var(--accent-amber);">22.0 Meters Lateral</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);">Gross Loaded Vehicle Weight:</span>
                    <strong style="color: #EDEFEF;">623 Metric Tons</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thermal Inversion Explained -->
          <div class="industrial-grid industrial-grid-2" style="margin-bottom: var(--space-12);">
            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">ATMOSPHERIC TRAPPING</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #EDEFEF; margin-bottom: 0.5rem;">
                Winter Radiation Inversion
              </h3>
              <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary);">
                Open-cast mine pits act as giant thermal basins. During calm winter nights, dense cold air drains down the haul ramps to the pit floor. When warmer air seals the pit rim from above, exhaust fumes, moisture, and fine coal dust are locked into a stagnant, impenetrable layer of radiation fog that lingers for hours past sunrise.
              </p>
            </div>

            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">ENGINEERING DISCIPLINE</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #EDEFEF; margin-bottom: 0.5rem;">
                Why FOSAFE Rejects Hype
              </h3>
              <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary);">
                Mining lives depend on predictability, not buzzwords. We do not claim our sensors "see through fog with magical AI." We use high-frequency acoustic ultrasound that is physically impervious to water droplets, calibrated 6-DOF inertial measurement, and deterministic braking envelopes tested against gravitational deceleration on steep grades.
              </p>
            </div>
          </div>

          <!-- Core Values -->
          <div>
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: #EDEFEF; margin-bottom: 1.5rem;">
              OUR THREE ENGINEERING AXIOMS
            </h3>

            <div class="industrial-grid industrial-grid-3">
              <div class="metric-box">
                <span class="data-label" style="color: var(--accent-amber);">AXIOM 01</span>
                <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: #EDEFEF; margin: 0.35rem 0;">
                  Edge Over Cloud
                </h4>
                <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary);">
                  A safety system that halts when cellular or RF reception drops in a deep bench is not a safety system. All collision logic executes locally on Core 1 in &lt;15ms.
                </p>
              </div>

              <div class="metric-box">
                <span class="data-label" style="color: var(--accent-amber);">AXIOM 02</span>
                <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: #EDEFEF; margin: 0.35rem 0;">
                  Physical Honesty
                </h4>
                <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary);">
                  We explicitly separate live hardware sensor data from simulated models. Contextual sensors (like the DHT11) are identified accurately without inflated capabilities.
                </p>
              </div>

              <div class="metric-box">
                <span class="data-label" style="color: var(--accent-amber);">AXIOM 03</span>
                <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: #EDEFEF; margin: 0.35rem 0;">
                  Operator-Centric Ergonomics
                </h4>
                <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary);">
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
