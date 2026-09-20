/**
 * FOSAFE v2 TechnologyPage
 * Plain, human-friendly hardware and sensor guide with full bilingual EN/HI support.
 * Fully responsive with zero overflow and seamless Dark/Light modes.
 */

import { i18n } from '../lib/i18n.js';

export class TechnologyPage {
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
              <span>${i18n.t('tech.marker')}</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4.2vw, 3.4rem); font-weight: 700; color: var(--text-primary); word-break: break-word;">
              ${i18n.t('tech.title')}
            </h1>
            <p class="lead-text" style="margin-top: 0.5rem; word-break: break-word;">
              ${i18n.t('tech.lead')}
            </p>
          </div>

          <!-- Dual-Core Processing Architecture Panel -->
          <div class="station-panel" style="margin-bottom: var(--sp-8); min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">${i18n.t('tech.core_header')}</span>
                <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-top: 0.2rem;">ESP32-S3 High-Speed Safety Core</h3>
              </div>
              <span class="provenance-tag live">240 MHz Ultra-Fast Clock</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--sp-6); min-width: 0;">
              <!-- Core 0 -->
              <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--card-shadow); min-width: 0; word-break: break-word;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                  <strong style="font-family: var(--font-mono); font-size: 0.88rem; color: var(--accent-amber);">${i18n.t('tech.core0_title')}</strong>
                  <span class="survey-label" style="font-size: 0.65rem;">${i18n.t('tech.core0_badge')}</span>
                </div>
                <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem; color: var(--text-secondary);">
                  ${i18n.t('tech.core0_desc')}
                </p>
                <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-muted); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                  <span>• Long-range radio mesh link</span>
                  <span>• Live satellite GPS tracking</span>
                  <span>• Emergency warning broadcasts</span>
                </div>
              </div>

              <!-- Core 1 -->
              <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--card-shadow); min-width: 0; word-break: break-word;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                  <strong style="font-family: var(--font-mono); font-size: 0.88rem; color: var(--state-normal);">${i18n.t('tech.core1_title')}</strong>
                  <span class="provenance-tag live" style="font-size: 0.65rem;">${i18n.t('tech.core1_badge')}</span>
                </div>
                <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem; color: var(--text-secondary);">
                  ${i18n.t('tech.core1_desc')}
                </p>
                <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-muted); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                  <span>• Distance ultrasound & radar scanning</span>
                  <span>• Motion & road tilt angle detection</span>
                  <span>• Instant loud audio buzzer alarm</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sensor Table Panel -->
          <div class="station-panel" style="min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">ONBOARD SENSORS</span>
                <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-top: 0.2rem;">${i18n.t('tech.table_title')}</h3>
              </div>
              <span class="provenance-tag live">INDUSTRIAL GRADE</span>
            </div>

            <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
              <table style="width: 100%; border-collapse: collapse; min-width: 580px; font-size: 0.85rem;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--line-strong); text-align: left;">
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">SENSOR</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">ROLE</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">SPEED</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">BACKUP SAFETY</th>
                  </tr>
                </thead>
                <tbody class="font-mono">
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.85rem 0.5rem;"><strong style="color: var(--text-primary);">Ultrasonic Distance Sonar</strong></td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary);">Detects obstacles in heavy fog</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--accent-amber);">25x / sec</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-muted);">Auto-holds safe buffer</td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.85rem 0.5rem;"><strong style="color: var(--text-primary);">6-Axis Motion & Tilt IMU</strong></td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary);">Measures downhill slope angle</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--accent-amber);">100x / sec</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-muted);">Assumes safe default grade</td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.85rem 0.5rem;"><strong style="color: var(--text-primary);">High-Precision GPS</strong></td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary);">Truck coordinates on mine map</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--accent-amber);">10x / sec</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-muted);">Dead reckoning via motion sensor</td>
                  </tr>
                  <tr>
                    <td style="padding: 0.85rem 0.5rem;"><strong style="color: var(--text-primary);">Humidity & Temperature</strong></td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary);">Monitors morning condensation</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--accent-amber);">1x / sec</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-muted);">Manual Fog Assist Button backup</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    `;
  }
}
