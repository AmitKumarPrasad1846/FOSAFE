/**
 * FOSAFE v2 CollaborationPage
 * Technical engagement framework for mining operators, safety regulators,
 * and telematics engineering partners. Factual, restrained, and engineering-first.
 * Fully supports Dark and Light modes.
 */

export class CollaborationPage {
  constructor(container) {
    this.container = container;
  }

  mount() {
    this.render();
    this.bindEvents();
  }

  unmount() {}

  bindEvents() {
    const form = this.container.querySelector('#trial-inquiry-form');
    const feedbackBox = this.container.querySelector('#trial-form-feedback');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const mineName = form.querySelector('#input-mine-name').value;
        const fleetSize = form.querySelector('#input-fleet-size').value;

        if (feedbackBox) {
          feedbackBox.style.display = 'block';
          feedbackBox.innerHTML = `
            <div class="telemetry-tag normal" style="margin-bottom: 0.5rem;"><span class="pulse-dot"></span>TRIAL PROPOSAL LOGGED</div>
            <p style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-primary); line-height: 1.5;">
              Field trial protocol generated for <strong>${mineName || 'Mine Operator'}</strong> (${fleetSize} target units). Our engineering group will review your pit geometry and radio frequency constraints.
            </p>
          `;
          form.reset();
        }
      });
    }
  }

  render() {
    this.container.innerHTML = `
      <div style="padding: calc(64px + var(--sp-8)) var(--sp-6) var(--sp-20);">
        <div style="max-width: 1320px; margin: 0 auto;">
          <!-- Page Header -->
          <div style="margin-bottom: var(--sp-12); max-width: 860px;">
            <div class="station-marker font-mono">
              <span>ENGINEERING ENGAGEMENT FRAMEWORK // STATION 05</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4.2rem); font-weight: 800; color: var(--text-primary); text-transform: uppercase;">
              COLLABORATION &amp; FIELD TRIALS
            </h1>
            <p class="lead-text" style="margin-top: 0.75rem;">
              FOSAFE is developed as an open, modular IoT safety architecture. We collaborate with mining operators, safety inspectors, and telematics equipment manufacturers to validate collision avoidance on active haul roads.
            </p>
          </div>

          <!-- Collaboration Pillars -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-6); margin-bottom: var(--sp-8);">
            <!-- Pillar 01 -->
            <div class="station-panel">
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                <span class="survey-label">01 // MINE OPERATORS</span>
                <span class="telemetry-tag normal">FIELD RETROFIT</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem; text-transform: uppercase;">
                Controlled Haul Road Pilots
              </h3>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.25rem;">
                Non-invasive retrofits designed to mount on ultra-class haulers (Cat, Komatsu, BelAZ, BEML) and support light inspection pickups. Evaluations focus on stopping buffer expansion during winter inversion fog.
              </p>
              <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-secondary); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                <span>• Magnetic/bracket IP67 exterior mounting</span>
                <span>• Zero interference with OEM hydraulic circuits</span>
                <span>• Isolated 24V DC auxiliary power tap</span>
              </div>
            </div>

            <!-- Pillar 02 -->
            <div class="station-panel">
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                <span class="survey-label">02 // SAFETY REGULATORS</span>
                <span class="telemetry-tag warning">DGMS COMPLIANCE</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem; text-transform: uppercase;">
                Standards &amp; Proximity Mandates
              </h3>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.25rem;">
                Aligned with DGMS safety circular mandates requiring proximity warning devices (PWD) and operator awareness aids on Heavy Earth Moving Machinery (HEMM) in open-cast workings.
              </p>
              <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-secondary); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                <span>• ISO 21815 collision awareness alignment</span>
                <span>• Deterministic audible in-cab warnings</span>
                <span>• Tamper-evident incident telemetry logs</span>
              </div>
            </div>

            <!-- Pillar 03 -->
            <div class="station-panel">
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                <span class="survey-label">03 // FMS INTEGRATORS</span>
                <span class="telemetry-tag simulated">CAN &amp; TELEMATICS</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem; text-transform: uppercase;">
                Fleet Management Uplink
              </h3>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.25rem;">
                Designed to co-exist with existing mine dispatch networks (Modular, Wenco, Hexagon). Telemetry can be ingested through standard MQTT brokers or local CAN SAE J1939 gateways.
              </p>
              <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-secondary); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                <span>• JSON / Protobuf telemetry schema</span>
                <span>• Low-bandwidth 868MHz mesh compatibility</span>
                <span>• RESTful fleet status query endpoints</span>
              </div>
            </div>
          </div>

          <!-- Field Evaluation Request Terminal -->
          <div class="station-panel">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">FIELD TRIAL REGISTRATION</span>
                <h3 style="font-size: 1.6rem; color: var(--text-primary); margin-top: 0.2rem;">TECHNICAL PILOT PROPOSAL FORM</h3>
              </div>
              <span class="provenance-tag live">SYSTEM INTAKE ACTIVE</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-8); align-items: start;">
              <div>
                <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--text-primary); margin-bottom: 0.5rem; text-transform: uppercase;">
                  Request Field Trial Architecture
                </h4>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.5rem;">
                  Submit your mine site specifications. Our engineering team reviews pit depth, seasonal fog severity, haul fleet compositions, and radio propagation constraints prior to proposing a trial architecture.
                </p>

                <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1.25rem; border-radius: var(--radius-xs);">
                  <div class="survey-label" style="margin-bottom: 0.5rem;">VERIFICATION CRITERIA</div>
                  <div class="small-mono" style="color: var(--text-secondary); line-height: 1.6;">
                    ✓ Open-cast coal, iron-ore, limestone, or bauxite operations<br/>
                    ✓ Documented low-visibility conditions (&lt;50m during shift)<br/>
                    ✓ Active haulage fleet of &ge; 4 heavy vehicles<br/>
                    ✓ Willingness to evaluate non-invasive hardware retrofits
                  </div>
                </div>
              </div>

              <!-- Interactive Form -->
              <form id="trial-inquiry-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div>
                  <label class="survey-label" style="display: block; margin-bottom: 0.4rem;">MINE SITE OR OPERATOR NAME</label>
                  <input type="text" id="input-mine-name" required placeholder="e.g. Western Pit Operations / Jharia Coalfield" style="width: 100%; background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 0.75rem 1rem; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs);" />
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div>
                    <label class="survey-label" style="display: block; margin-bottom: 0.4rem;">TARGET FLEET SIZE</label>
                    <select id="input-fleet-size" style="width: 100%; background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 0.75rem 1rem; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs);">
                      <option value="4-10 Trucks">4 – 10 Trucks (Pilot)</option>
                      <option value="11-30 Trucks">11 – 30 Trucks</option>
                      <option value="30+ Trucks">30+ Trucks (Pit Wide)</option>
                    </select>
                  </div>
                  <div>
                    <label class="survey-label" style="display: block; margin-bottom: 0.4rem;">PRIMARY MINERAL TYPE</label>
                    <input type="text" placeholder="e.g. Coal, Iron Ore" style="width: 100%; background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 0.75rem 1rem; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs);" />
                  </div>
                </div>

                <div>
                  <label class="survey-label" style="display: block; margin-bottom: 0.4rem;">TECHNICAL POINT OF CONTACT</label>
                  <input type="text" required placeholder="Name, Role, Engineering Email" style="width: 100%; background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 0.75rem 1rem; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs);" />
                </div>

                <button type="submit" class="btn-action-primary" style="margin-top: 0.5rem; justify-content: center;">
                  SUBMIT FIELD TRIAL SPECIFICATION
                </button>

                <div id="trial-form-feedback" style="display: none; background: var(--state-normal-bg); border: 1px solid var(--state-normal-border); padding: 1rem; border-radius: var(--radius-xs); margin-top: 0.5rem;"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
