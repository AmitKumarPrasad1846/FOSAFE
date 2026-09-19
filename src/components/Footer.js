/**
 * FOSAFE Industrial Specification Footer
 * Technical disclosure, system architecture index, standards reference.
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
      <div class="container">
        <div class="footer-top">
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
              <span style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; color: #EDEFEF; letter-spacing: 0.06em;">
                FOSAFE
              </span>
            </div>
            <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 1rem; max-width: 380px;">
              Fog-Aware Safety &amp; Fleet Monitoring System. Real-time vehicle awareness, dynamic collision avoidance envelopes, and centralized dispatch intelligence for heavy haulage operations in low-visibility open-cast mines.
            </p>
            <div class="footer-spec-badge">
              <span class="pulse-dot" style="background: var(--accent-amber);"></span>
              <span>ARCHITECTURE SPEC // v1.0.4-PROD</span>
            </div>
          </div>

          <!-- Col 2: Architecture Navigation -->
          <div>
            <div class="footer-col-title">SYSTEM PLATFORM</div>
            <ul class="footer-links">
              <li><a href="/technology" data-link class="footer-link">Vehicle Edge Unit &amp; Sensors</a></li>
              <li><a href="/how-it-works" data-link class="footer-link">Risk Arbitration Matrix</a></li>
              <li><a href="/platform" data-link class="footer-link">Driver Safety Console</a></li>
              <li><a href="/platform" data-link class="footer-link">Mine Fleet Control Room</a></li>
              <li><a href="/platform" data-link class="footer-link">Haul Simulation Sandbox</a></li>
            </ul>
          </div>

          <!-- Col 3: Industrial Engineering -->
          <div>
            <div class="footer-col-title">COLLABORATION</div>
            <ul class="footer-links">
              <li><a href="/collaboration" data-link class="footer-link">Mining Operator Trials</a></li>
              <li><a href="/collaboration" data-link class="footer-link">FMS &amp; CAN Bus Integration</a></li>
              <li><a href="/collaboration" data-link class="footer-link">Field Safety Validation</a></li>
              <li><a href="/about" data-link class="footer-link">Open-Cast Hazard Research</a></li>
              <li><a href="/login" data-link class="footer-link">Engineering Access Terminal</a></li>
            </ul>
          </div>

          <!-- Col 4: Technical Compliance Focus -->
          <div>
            <div class="footer-col-title">DOMAIN ALIGNMENT</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim); display: flex; flex-direction: column; gap: 0.6rem;">
              <div>
                <strong style="color: var(--steel-300); display: block;">DGMS SAFETY GUIDELINE</strong>
                Collision avoidance &amp; proximity warning system alignment for HEMM operations.
              </div>
              <div>
                <strong style="color: var(--steel-300); display: block;">ISO 21815 FRAMEWORK</strong>
                Collision awareness and avoidance architecture for earth-moving machinery.
              </div>
              <div>
                <strong style="color: var(--steel-300); display: block;">HARDWARE INTEGRITY</strong>
                Dual-core ESP32 edge processing with deterministic sensor bus polling.
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Technical Bar -->
        <div class="footer-bottom">
          <div>
            &copy; 2026 FOSAFE Platform. Built for open-cast mine haul road safety.
          </div>
          <div style="display: flex; gap: 1.5rem;">
            <span>LATENCY: &lt; 45ms LOCAL LOOP</span>
            <span>RADIO: 868MHz / LTE / ESP-NOW</span>
            <span>POWER: 24V MINE SPEC</span>
          </div>
        </div>
      </div>
    `;
  }
}
