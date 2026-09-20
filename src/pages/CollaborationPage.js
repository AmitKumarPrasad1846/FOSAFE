/**
 * FOSAFE v2 CollaborationPage
 * Plain-language guide for mine operators and safety regulators.
 * Interactive trial inquiry form with bilingual EN/HI support and zero overflow.
 */

import { i18n } from '../lib/i18n.js';

export class CollaborationPage {
  constructor(container) {
    this.container = container;
    this.unsubscribeLang = null;
  }

  mount() {
    this.render();
    this.bindEvents();

    this.unsubscribeLang = i18n.subscribe(() => {
      this.render();
      this.bindEvents();
    });
  }

  unmount() {
    if (this.unsubscribeLang) {
      this.unsubscribeLang();
      this.unsubscribeLang = null;
    }
  }

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
            <div class="telemetry-tag normal" style="margin-bottom: 0.4rem;"><span class="pulse-dot"></span>REQUEST CONFIRMED</div>
            <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary); line-height: 1.5; margin: 0;">
              Thank you! A trial plan has been generated for <strong>${mineName || 'Mine Site'}</strong> with <strong>${fleetSize || '10+'} trucks</strong>. Our field engineers will reach out with the demonstration protocol.
            </p>
          `;
          form.reset();
        }
      });
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="subpage-container">
        <div class="station-container">
          
          <!-- Page Header -->
          <div style="margin-bottom: var(--sp-8); max-width: 820px; min-width: 0;">
            <div class="station-marker font-mono">
              <span>${i18n.t('collab.marker')}</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4.2vw, 3.4rem); font-weight: 700; color: var(--text-primary); word-break: break-word;">
              ${i18n.t('collab.title')}
            </h1>
            <p class="lead-text" style="margin-top: 0.5rem; word-break: break-word;">
              ${i18n.t('collab.lead')}
            </p>
          </div>

          <!-- Collaboration Pillars Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--sp-6); margin-bottom: var(--sp-8); min-width: 0;">
            
            <div class="station-panel" style="min-width: 0; word-break: break-word;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                <span class="survey-label">01 // MINE OPERATORS</span>
                <span class="telemetry-tag normal">EASY INSTALLATION</span>
              </div>
              <h3 style="font-size: 1.3rem; color: var(--text-primary); margin-bottom: 0.5rem;">
                Fits Existing Mining Trucks
              </h3>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem;">
                Installs on standard 24V haul trucks (Caterpillar, Komatsu, BEML) and inspection pickups without touching the hydraulic braking circuits.
              </p>
              <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-muted); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                <span>• Waterproof IP67 brackets</span>
                <span>• Connects to 24V truck battery</span>
                <span>• Quick 2-hour installation per truck</span>
              </div>
            </div>

            <div class="station-panel" style="min-width: 0; word-break: break-word;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                <span class="survey-label">02 // SAFETY INSPECTORS</span>
                <span class="telemetry-tag warning">SAFETY COMPLIANT</span>
              </div>
              <h3 style="font-size: 1.3rem; color: var(--text-primary); margin-bottom: 0.5rem;">
                Compliant with Mine Guidelines
              </h3>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem;">
                Directly aligns with Directorate General of Mines Safety (DGMS) circulars requiring Proximity Warning Devices on Heavy Machinery in open-cast mines.
              </p>
              <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-muted); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                <span>• Loud in-cab buzzer alarms</span>
                <span>• Tamper-proof safety memory</span>
                <span>• Clear blind spot visual indicators</span>
              </div>
            </div>

            <div class="station-panel" style="min-width: 0; word-break: break-word;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                <span class="survey-label">03 // DISPATCH INTEGRATION</span>
                <span class="telemetry-tag normal">RADIO &amp; GPS</span>
              </div>
              <h3 style="font-size: 1.3rem; color: var(--text-primary); margin-bottom: 0.5rem;">
                Connects to Control Rooms
              </h3>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem;">
                Streams truck speed, position, and active fog alerts to existing mine dispatch software via radio mesh or LTE.
              </p>
              <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-muted); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                <span>• Live web dashboard for supervisors</span>
                <span>• Automated incident logs</span>
                <span>• Radio emergency broadcasts</span>
              </div>
            </div>

          </div>

          <!-- Interactive Request Form -->
          <div class="station-panel" style="max-width: 780px; margin: 0 auto; min-width: 0;">
            <div style="border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <span class="survey-label" style="color: var(--accent-amber);">PILOT PROGRAM</span>
              <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-top: 0.2rem;">
                ${i18n.t('collab.form_title')}
              </h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">
                Leave your mine details below to receive hardware specifications and a demonstration schedule.
              </p>
            </div>

            <form id="trial-inquiry-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
                <div>
                  <label for="input-mine-name" class="survey-label" style="display: block; margin-bottom: 0.4rem;">
                    ${i18n.t('collab.form_name')}
                  </label>
                  <input id="input-mine-name" type="text" required placeholder="e.g., Jharia Coal Pit No. 4" style="width: 100%; padding: 0.75rem 1rem; background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; font-size: 0.9rem;" />
                </div>
                <div>
                  <label for="input-fleet-size" class="survey-label" style="display: block; margin-bottom: 0.4rem;">
                    ${i18n.t('collab.form_fleet')}
                  </label>
                  <input id="input-fleet-size" type="number" min="1" max="500" value="12" style="width: 100%; padding: 0.75rem 1rem; background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; font-size: 0.9rem;" />
                </div>
              </div>

              <div id="trial-form-feedback" style="display: none; padding: 1rem; background: var(--state-normal-bg); border: 1px solid var(--state-normal-border); border-radius: var(--radius-md);"></div>

              <button type="submit" class="btn-action-primary" style="align-self: flex-start; padding: 0.8rem 1.8rem;">
                <span>${i18n.t('collab.form_submit')}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    `;
  }
}
