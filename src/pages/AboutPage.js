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
          <div style="margin-bottom: var(--sp-8); max-width: 820px;">
            <div class="station-marker font-mono">
              <span>DOMAIN REALITIES // ETHOS</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2.2rem, 4.5vw, 3.8rem); font-weight: 700; color: var(--text-primary);">
              The Haul Road Reality
            </h1>
            <p class="lead-text" style="margin-top: 0.5rem;">
              FOSAFE addresses physical hazards unique to deep open-cast mining pits: massive vehicular scale, steep haulage ramps, and stagnant thermal inversion fog.
            </p>
          </div>

          <!-- Section: The Physical Disconnect -->
          <div class="station-panel" style="margin-bottom: var(--sp-8);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">PHYSICAL HAZARDS</span>
                <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-top: 0.2rem;">Blind Spot Geometry of Heavy Haulage</h3>
              </div>
              <span class="telemetry-tag critical">CRITICAL SIGHTLINE LIMIT</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-8); align-items: center;">
              <div>
                <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--text-primary); margin-bottom: 0.5rem;">
                  A Driver 5.5 Meters Above Ground
                </h4>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0.75rem;">
                  In ultra-class haulers (Cat 797F, Komatsu 930E), operator eye height exceeds 5.5 meters. The front bumper ground blind zone reaches 14+ meters forward and 22 meters laterally along the passenger flank.
                </p>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0;">
                  Inspection pickups parked within this perimeter are completely invisible to the driver. In winter radiation fog or excavation dust, these blind perimeters turn fatal without telemetric alerts.
                </p>
              </div>

              <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--card-shadow);">
                <div class="survey-label" style="color: var(--accent-amber); margin-bottom: 0.75rem;">HAUL TRUCK VISIBILITY LIMITS (CAT 797F)</div>
                <div style="display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-mono); font-size: 0.78rem;">
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line-subtle); padding-bottom: 0.4rem;">
                    <span style="color: var(--text-muted);">Cab Operator Eye Height:</span>
                    <strong style="color: var(--text-primary);">5.60 Meters</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line-subtle); padding-bottom: 0.4rem;">
                    <span style="color: var(--text-muted);">Front Bumper Blind Zone:</span>
                    <strong style="color: var(--state-critical);">14.5 Meters Forward</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line-subtle); padding-bottom: 0.4rem;">
                    <span style="color: var(--text-muted);">Lateral Passenger Blind Zone:</span>
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

          <!-- Thermal Inversion & Engineering Discipline -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-6); margin-bottom: var(--sp-8);">
            <div class="station-panel">
              <div style="border-bottom: 1px solid var(--line-structure); padding-bottom: 0.6rem; margin-bottom: 0.75rem;">
                <span class="survey-label">ATMOSPHERIC TRAPPING</span>
                <h3 style="font-family: var(--font-display); font-size: 1.35rem; color: var(--text-primary); margin-top: 0.2rem;">
                  Winter Radiation Inversion
                </h3>
              </div>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin: 0;">
                Open-cast mine pits act as giant thermal basins. Cold air drains down haul ramps to the pit floor, trapped beneath warm upper layers. Moisture and fine coal dust form dense, stagnant fog that lingers for hours.
              </p>
            </div>

            <div class="station-panel">
              <div style="border-bottom: 1px solid var(--line-structure); padding-bottom: 0.6rem; margin-bottom: 0.75rem;">
                <span class="survey-label">PHYSICAL DISCIPLINE</span>
                <h3 style="font-family: var(--font-display); font-size: 1.35rem; color: var(--text-primary); margin-top: 0.2rem;">
                  Engineering Over Hype
                </h3>
              </div>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin: 0;">
                We reject exaggerated claims. FOSAFE uses 40kHz acoustic ultrasound impervious to moisture droplets, calibrated 6-DOF inertial dead-reckoning, and deterministic deceleration physics tested on steep ramps.
              </p>
            </div>
          </div>

          <!-- Core Axioms -->
          <div>
            <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 1.25rem;">
              Our Three Engineering Axioms
            </h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--sp-6);">
              <div class="station-panel">
                <span class="survey-label" style="color: var(--accent-amber);">AXIOM 01</span>
                <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary); margin: 0.35rem 0;">
                  Edge Over Cloud
                </h4>
                <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin: 0;">
                  Safety must not stall when RF signals fade in deep pit benches. Collision arbitration executes locally in &lt;15ms.
                </p>
              </div>

              <div class="station-panel">
                <span class="survey-label" style="color: var(--accent-amber);">AXIOM 02</span>
                <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary); margin: 0.35rem 0;">
                  Physical Honesty
                </h4>
                <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin: 0;">
                  Explicit separation between active sensor telemetry and synthetic simulation models. Every sensor is disclosed with exact specifications.
                </p>
              </div>

              <div class="station-panel">
                <span class="survey-label" style="color: var(--accent-amber);">AXIOM 03</span>
                <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary); margin: 0.35rem 0;">
                  Driver Ergonomics
                </h4>
                <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin: 0;">
                  A driver commanding a 400t hauler cannot decipher complex dashboards. High-contrast radar rings and audio tones provide zero-cognitive-load safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
