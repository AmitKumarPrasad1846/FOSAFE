/**
 * FOSAFE v2 AboutPage
 * Deep domain context: open-cast mining realities, massive truck blind spots,
 * winter morning fog hazards, and why FOSAFE was engineered.
 * Full bilingual EN/HI support and zero overflow.
 */

import { i18n } from '../lib/i18n.js';

export class AboutPage {
  constructor(container) {
    this.container = container;
    this.unsubscribeLang = null;
  }

  mount() {
    this.render();
    this.unsubscribeLang = i18n.subscribe(() => {
      this.render();
    });
  }

  unmount() {
    if (this.unsubscribeLang) {
      this.unsubscribeLang();
      this.unsubscribeLang = null;
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="subpage-container">
        <div class="station-container">
          
          <!-- Page Header -->
          <div style="margin-bottom: var(--sp-8); max-width: 820px; min-width: 0;">
            <div class="station-marker font-mono">
              <span>${i18n.t('about.marker')}</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4.2vw, 3.4rem); font-weight: 700; color: var(--text-primary); word-break: break-word;">
              ${i18n.t('about.title')}
            </h1>
            <p class="lead-text" style="margin-top: 0.5rem; word-break: break-word;">
              ${i18n.t('about.lead')}
            </p>
          </div>

          <!-- Section 1: The Blind Spot Geometry -->
          <div class="station-panel" style="margin-bottom: var(--sp-8); min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">PHYSICAL DANGER</span>
                <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-top: 0.2rem;">${i18n.t('about.blind_title')}</h3>
              </div>
              <span class="telemetry-tag critical">FATAL BLIND SPOTS</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--sp-8); align-items: center; min-width: 0;">
              <div>
                <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary); margin-bottom: 0.5rem;">
                  The Driver Sits Two Stories in the Air
                </h4>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0.75rem;">
                  ${i18n.t('about.blind_desc')}
                </p>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 0;">
                  During cold winter mornings, fog settles into the bottom of the mine pit. Drivers cannot see pickup trucks or workers directly in their path until it is physically too late to stop.
                </p>
              </div>

              <!-- Measurement Card -->
              <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--card-shadow); min-width: 0;">
                <div class="survey-label" style="color: var(--accent-amber); margin-bottom: 0.75rem;">HAUL TRUCK BLIND ZONE SPECS (CAT 797F)</div>
                <div style="display: flex; flex-direction: column; gap: 0.65rem; font-family: var(--font-mono); font-size: 0.8rem;">
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line-subtle); padding-bottom: 0.4rem;">
                    <span style="color: var(--text-muted);">Cab Driver Eye Height:</span>
                    <strong style="color: var(--text-primary);">5.6 Meters (18 Feet)</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line-subtle); padding-bottom: 0.4rem;">
                    <span style="color: var(--text-muted);">Front Bumper Blind Zone:</span>
                    <strong style="color: var(--state-critical);">14.5 Meters Forward</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--line-subtle); padding-bottom: 0.4rem;">
                    <span style="color: var(--text-muted);">Left/Right Blind Perimeter:</span>
                    <strong style="color: var(--accent-amber);">22.0 Meters Lateral</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);">Loaded Truck Weight:</span>
                    <strong style="color: var(--text-primary);">623 Metric Tons</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Core Philosophy -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--sp-6); min-width: 0;">
            <div class="station-panel" style="min-width: 0; word-break: break-word;">
              <div style="border-bottom: 1px solid var(--line-structure); padding-bottom: 0.6rem; margin-bottom: 0.75rem;">
                <span class="survey-label">COLD WINTER BASIN</span>
                <h3 style="font-size: 1.3rem; color: var(--text-primary); margin-top: 0.2rem;">
                  Trapped Morning Fog
                </h3>
              </div>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin: 0;">
                Open-cast mine pits are up to 300 meters deep. Cold, heavy air sinks to the pit floor like water in a bowl. Combined with coal dust, this creates thick, zero-visibility fog that stays trapped for hours.
              </p>
            </div>

            <div class="station-panel" style="min-width: 0; word-break: break-word;">
              <div style="border-bottom: 1px solid var(--line-structure); padding-bottom: 0.6rem; margin-bottom: 0.75rem;">
                <span class="survey-label">OUR CORE PRINCIPLE</span>
                <h3 style="font-size: 1.3rem; color: var(--text-primary); margin-top: 0.2rem;">
                  Never Rely on Internet
                </h3>
              </div>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin: 0;">
                Mining lives cannot depend on cellular signal in a deep pit. FOSAFE's on-truck box makes 100% of emergency warning decisions right on the vehicle in under 15 milliseconds.
              </p>
            </div>
          </div>

        </div>
      </div>
    `;
  }
}
