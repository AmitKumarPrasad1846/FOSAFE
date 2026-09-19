/**
 * FOSAFE CollaborationPage
 * Technical engagement framework for mining operators, safety regulators,
 * and telematics engineering partners. Factual, restrained, and engineering-first.
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
            <p style="font-family: var(--font-mono); font-size: 0.82rem; color: #EDEFEF;">
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
      <div style="padding: var(--space-12) 0 var(--space-20);">
        <div class="container">
          <!-- Page Header -->
          <div style="margin-bottom: var(--space-12);">
            <div class="section-eyebrow">
              <span class="pulse-dot"></span>
              <span>ENGINEERING PARTNERSHIP ARCHITECTURE</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #EDEFEF; text-transform: uppercase;">
              COLLABORATION &amp; FIELD TRIALS
            </h1>
            <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 780px; margin-top: 0.75rem; line-height: 1.6;">
              FOSAFE is developed as an open, modular IoT safety architecture. We collaborate with mining operators, safety inspectors, and telematics equipment manufacturers to validate collision avoidance on active haul roads.
            </p>
          </div>

          <!-- Collaboration Pillars -->
          <div class="industrial-grid industrial-grid-3" style="margin-bottom: var(--space-12);">
            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">01 // MINE OPERATORS</span>
                <span class="telemetry-tag normal">FIELD RETROFIT</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #EDEFEF; margin-bottom: 0.5rem;">
                Controlled Haul Road Pilots
              </h3>
              <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 1rem;">
                Non-invasive retrofits designed to mount on ultra-class haulers (Cat, Komatsu, BelAZ, BEML) and support light inspection pickups. Evaluations focus on stopping buffer expansion during winter inversion fog.
              </p>
              <div class="footer-links" style="font-size: 0.75rem;">
                <span class="mono-readout" style="color: var(--steel-300);">• Magnetic/bracket IP67 exterior mounting</span>
                <span class="mono-readout" style="color: var(--steel-300);">• Zero interference with OEM hydraulic circuits</span>
                <span class="mono-readout" style="color: var(--steel-300);">• Isolated 24V DC auxiliary power tap</span>
              </div>
            </div>

            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">02 // SAFETY REGULATORS</span>
                <span class="telemetry-tag warning">DGMS COMPLIANCE</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #EDEFEF; margin-bottom: 0.5rem;">
                Standards &amp; Proximity Mandates
              </h3>
              <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 1rem;">
                Aligned with DGMS safety circular mandates requiring proximity warning devices (PWD) and operator awareness aids on Heavy Earth Moving Machinery (HEMM) in open-cast workings.
              </p>
              <div class="footer-links" style="font-size: 0.75rem;">
                <span class="mono-readout" style="color: var(--steel-300);">• ISO 21815 collision awareness alignment</span>
                <span class="mono-readout" style="color: var(--steel-300);">• Deterministic audible in-cab warnings</span>
                <span class="mono-readout" style="color: var(--steel-300);">• Tamper-evident incident telemetry logs</span>
              </div>
            </div>

            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">03 // FMS INTEGRATORS</span>
                <span class="telemetry-tag simulated">CAN &amp; TELEMATICS</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: #EDEFEF; margin-bottom: 0.5rem;">
                Fleet Management Uplink
              </h3>
              <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 1rem;">
                Designed to co-exist with existing mine dispatch networks (Modular, Wenco, Hexagon). Telemetry can be ingested through standard MQTT brokers or local CAN SAE J1939 gateways.
              </p>
              <div class="footer-links" style="font-size: 0.75rem;">
                <span class="mono-readout" style="color: var(--steel-300);">• JSON / Protobuf telemetry schema</span>
                <span class="mono-readout" style="color: var(--steel-300);">• Low-bandwidth 868MHz mesh compatibility</span>
                <span class="mono-readout" style="color: var(--steel-300);">• RESTful fleet status query endpoints</span>
              </div>
            </div>
          </div>

          <!-- Field Evaluation Request Terminal -->
          <div class="tech-panel">
            <div class="tech-header">
              <span class="tech-title">TECHNICAL PILOT PROPOSAL FORM</span>
              <span class="mono-readout" style="font-size: 0.72rem; color: var(--accent-amber);">SYSTEM INTAKE // RESTRICTED TO QUALIFIED OPERATORS</span>
            </div>

            <div class="industrial-grid industrial-grid-2" style="margin-top: 1rem;">
              <div>
                <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: #EDEFEF; margin-bottom: 0.5rem;">
                  Request Field Trial Architecture
                </h4>
                <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 1.25rem;">
                  Submit your mine site specifications. Our engineering team reviews pit depth, seasonal fog severity, haul fleet compositions, and radio propagation constraints prior to proposing a trial architecture.
                </p>

                <div style="background: #090B0F; border: 1px solid var(--border-subtle); padding: 1rem; border-radius: var(--radius-xs);">
                  <div class="data-label" style="color: var(--steel-300); margin-bottom: 0.35rem;">VERIFICATION CRITERIA</div>
                  <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">
                    ✓ Open-cast coal, iron-ore, limestone, or bauxite operations<br/>
                    ✓ Documented low-visibility conditions (&lt;50m during shift)<br/>
                    ✓ Active haulage fleet of &ge; 4 heavy vehicles<br/>
                    ✓ Willingness to evaluate non-invasive hardware retrofits
                  </div>
                </div>
              </div>

              <!-- Interactive Form -->
              <form id="trial-inquiry-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                  <label class="data-label" style="display: block; margin-bottom: 0.35rem;">MINE SITE OR OPERATOR NAME</label>
                  <input type="text" id="input-mine-name" required placeholder="e.g. Western Pit Operations / Jharia Coalfield" style="width: 100%; background: #080A0E; border: 1px solid var(--border-medium); padding: 0.65rem 0.85rem; color: #EDEFEF; font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs);" />
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  <div>
                    <label class="data-label" style="display: block; margin-bottom: 0.35rem;">TARGET FLEET SIZE</label>
                    <select id="input-fleet-size" style="width: 100%; background: #080A0E; border: 1px solid var(--border-medium); padding: 0.65rem 0.85rem; color: #EDEFEF; font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs);">
                      <option value="4-10 Trucks">4 – 10 Trucks (Pilot)</option>
                      <option value="11-30 Trucks">11 – 30 Trucks</option>
                      <option value="30+ Trucks">30+ Trucks (Pit Wide)</option>
                    </select>
                  </div>
                  <div>
                    <label class="data-label" style="display: block; margin-bottom: 0.35rem;">PRIMARY MINERAL TYPE</label>
                    <input type="text" placeholder="e.g. Coal, Iron Ore" style="width: 100%; background: #080A0E; border: 1px solid var(--border-medium); padding: 0.65rem 0.85rem; color: #EDEFEF; font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs);" />
                  </div>
                </div>

                <div>
                  <label class="data-label" style="display: block; margin-bottom: 0.35rem;">TECHNICAL POINT OF CONTACT</label>
                  <input type="text" required placeholder="Name, Role, Engineering Email" style="width: 100%; background: #080A0E; border: 1px solid var(--border-medium); padding: 0.65rem 0.85rem; color: #EDEFEF; font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs);" />
                </div>

                <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem;">
                  SUBMIT FIELD TRIAL SPECIFICATION
                </button>

                <div id="trial-form-feedback" style="display: none; background: #090B0F; border: 1px solid var(--status-normal-border); padding: 0.85rem; border-radius: var(--radius-xs); margin-top: 0.5rem;"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
