/**
 * FOSAFE v2 Industrial Specification Footer
 * Technical disclosure, system architecture index, standards reference.
 * Fully supports Dark and Light modes.
 */

export class Footer {
  constructor(footerElement) {
    this.footer = footerElement;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.footer.innerHTML = `
      <div style="max-width: 1320px; margin: 0 auto; padding: 0 var(--sp-6);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--sp-8); padding-bottom: var(--sp-12); border-bottom: 1px solid var(--line-structure);">
          <!-- Col 1: System Identity -->
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <div class="brand-logo-mark" style="width: 24px; height: 24px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--text-primary); letter-spacing: 0.08em;">
                FOSAFE
              </span>
            </div>
            <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 1.25rem; max-width: 360px;">
              Fog-Aware Safety &amp; Fleet Monitoring System. Real-time vehicle awareness, dynamic collision avoidance envelopes, and centralized dispatch intelligence for heavy haulage operations in low-visibility open-cast mines.
            </p>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.65rem; background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-xs); font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary);">
              <span class="capsule-status-dot" style="background: var(--accent-amber); box-shadow: 0 0 8px rgba(245, 158, 11, 0.7);"></span>
              <span>SPECIFICATION // v1.0.4-PROD</span>
            </div>
          </div>

          <!-- Col 2: Architecture Navigation -->
          <div>
            <div class="survey-label" style="margin-bottom: 0.75rem;">SYSTEM PLATFORM</div>
            <ul style="display: flex; flex-direction: column; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.8rem;">
              <li><a href="/technology" data-link style="color: var(--text-secondary); text-decoration: none;">Vehicle Edge Unit &amp; Sensors</a></li>
              <li><a href="/how-it-works" data-link style="color: var(--text-secondary); text-decoration: none;">Risk Arbitration Matrix</a></li>
              <li><a href="/platform" data-link style="color: var(--text-secondary); text-decoration: none;">Driver Safety Console</a></li>
              <li><a href="/platform" data-link style="color: var(--text-secondary); text-decoration: none;">Mine Fleet Control Room</a></li>
              <li><a href="/platform" data-link style="color: var(--text-secondary); text-decoration: none;">Haul Simulation Sandbox</a></li>
            </ul>
          </div>

          <!-- Col 3: Industrial Engineering -->
          <div>
            <div class="survey-label" style="margin-bottom: 0.75rem;">COLLABORATION</div>
            <ul style="display: flex; flex-direction: column; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.8rem;">
              <li><a href="/collaboration" data-link style="color: var(--text-secondary); text-decoration: none;">Mining Operator Trials</a></li>
              <li><a href="/collaboration" data-link style="color: var(--text-secondary); text-decoration: none;">FMS &amp; CAN Bus Integration</a></li>
              <li><a href="/collaboration" data-link style="color: var(--text-secondary); text-decoration: none;">Field Safety Validation</a></li>
              <li><a href="/about" data-link style="color: var(--text-secondary); text-decoration: none;">Open-Cast Hazard Research</a></li>
              <li><a href="/login" data-link style="color: var(--text-secondary); text-decoration: none;">Engineering Access Terminal</a></li>
            </ul>
          </div>

          <!-- Col 4: Technical Compliance Focus -->
          <div>
            <div class="survey-label" style="margin-bottom: 0.75rem;">DOMAIN ALIGNMENT</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.75rem;">
              <div>
                <strong style="color: var(--text-primary); display: block; margin-bottom: 2px;">DGMS SAFETY GUIDELINE</strong>
                Collision avoidance &amp; proximity warning system alignment for HEMM operations.
              </div>
              <div>
                <strong style="color: var(--text-primary); display: block; margin-bottom: 2px;">ISO 21815 FRAMEWORK</strong>
                Collision awareness and avoidance architecture for earth-moving machinery.
              </div>
              <div>
                <strong style="color: var(--text-primary); display: block; margin-bottom: 2px;">HARDWARE INTEGRITY</strong>
                Dual-core ESP32 edge processing with deterministic sensor bus polling.
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Technical Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-top: var(--sp-8); font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">
          <div>
            &copy; 2026 FOSAFE Platform. Built for open-cast mine haul road safety.
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 1.25rem;">
            <span>LATENCY: &lt; 45ms LOCAL LOOP</span>
            <span>RADIO: 868MHz / LTE / ESP-NOW</span>
            <span>POWER: 24V MINE SPEC</span>
          </div>
        </div>
      </div>
    `;
  }
}
