/**
 * FOSAFE v2 PlatformPage
 * Unified platform interface showcasing the In-Cab Screen, Control Room, and Simulation Testbench.
 * Full bilingual EN/HI support, responsive tab navigation, and zero overflow.
 */

import { DriverConsolePreview } from '../visualizations/DriverConsolePreview.js';
import { MineControlRoomPreview } from '../visualizations/MineControlRoomPreview.js';
import { i18n } from '../lib/i18n.js';

export class PlatformPage {
  constructor(container) {
    this.container = container;
    this.activeTab = 'driver';
    this.activeInstances = [];
    this.unsubscribeLang = null;
  }

  mount() {
    this.render();
    this.bindEvents();
    this.initCurrentTab();

    this.unsubscribeLang = i18n.subscribe(() => {
      this.clearInstances();
      this.render();
      this.bindEvents();
      this.initCurrentTab();
    });
  }

  unmount() {
    if (this.unsubscribeLang) {
      this.unsubscribeLang();
      this.unsubscribeLang = null;
    }
    this.clearInstances();
  }

  clearInstances() {
    this.activeInstances.forEach(inst => {
      if (inst && typeof inst.destroy === 'function') {
        inst.destroy();
      }
    });
    this.activeInstances = [];
  }

  setTab(tab) {
    this.activeTab = tab;
    this.clearInstances();
    this.render();
    this.bindEvents();
    this.initCurrentTab();
  }

  initCurrentTab() {
    if (this.activeTab === 'driver') {
      const el = this.container.querySelector('#platform-driver-mount');
      if (el) {
        const inst = new DriverConsolePreview(el);
        this.activeInstances.push(inst);
      }
    } else if (this.activeTab === 'control') {
      const el = this.container.querySelector('#platform-control-mount');
      if (el) {
        const inst = new MineControlRoomPreview(el);
        this.activeInstances.push(inst);
      }
    } else if (this.activeTab === 'simulator') {
      this.initSimulator();
    }
  }

  initSimulator() {
    const runSimBtn = this.container.querySelector('#run-sim-batch-btn');
    const simLog = this.container.querySelector('#sim-console-output');

    if (runSimBtn && simLog) {
      runSimBtn.addEventListener('click', () => {
        simLog.textContent = 'STARTING VIRTUAL FOG SIMULATION...\n';
        const lines = [
          '[SIM] Placing 24 virtual haul trucks across Pit Benches 01-06',
          '[SIM] Weather set: DENSE MORNING FOG (15m sightline)',
          '[SIM] Truck D-07 approaching Scout Unit S-01 on Ramp 04 blind curve',
          '[ALERT] Distance closing: 24.2m -> Loud buzzer & strobe triggered in cab',
          '[BRAKE] Driver decelerates safely. Distance held at 8.4m.',
          '[RESULT] SUCCESS: Zero collisions across 5,000 virtual trial runs.'
        ];

        lines.forEach((line, idx) => {
          setTimeout(() => {
            simLog.textContent += line + '\n';
            simLog.scrollTop = simLog.scrollHeight;
          }, (idx + 1) * 350);
        });
      });
    }
  }

  bindEvents() {
    this.container.querySelectorAll('[data-platform-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-platform-tab');
        this.setTab(tab);
      });
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="subpage-container">
        <div class="station-container">
          
          <!-- Page Header -->
          <div style="margin-bottom: var(--sp-6); max-width: 820px; min-width: 0;">
            <div class="station-marker font-mono">
              <span>${i18n.t('platform.marker')}</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4.2vw, 3.4rem); font-weight: 700; color: var(--text-primary); word-break: break-word;">
              ${i18n.t('platform.title')}
            </h1>
            <p class="lead-text" style="margin-top: 0.5rem; word-break: break-word;">
              ${i18n.t('platform.lead')}
            </p>
          </div>

          <!-- Tab Selector Bar -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: var(--sp-6); flex-wrap: wrap;">
            <button data-platform-tab="driver" class="capsule-nav-link ${this.activeTab === 'driver' ? 'is-active' : ''}" style="padding: 0.65rem 1.25rem; font-size: 0.8rem; cursor: pointer; border: 1px solid var(--line-structure);">
              ${i18n.t('platform.tab_driver')}
            </button>
            <button data-platform-tab="control" class="capsule-nav-link ${this.activeTab === 'control' ? 'is-active' : ''}" style="padding: 0.65rem 1.25rem; font-size: 0.8rem; cursor: pointer; border: 1px solid var(--line-structure);">
              ${i18n.t('platform.tab_control')}
            </button>
            <button data-platform-tab="simulator" class="capsule-nav-link ${this.activeTab === 'simulator' ? 'is-active' : ''}" style="padding: 0.65rem 1.25rem; font-size: 0.8rem; cursor: pointer; border: 1px solid var(--line-structure);">
              ${i18n.t('platform.tab_simulator')}
            </button>
          </div>

          <!-- Tab Content Views -->
          ${this.activeTab === 'driver' ? `
            <div id="platform-driver-mount"></div>
          ` : ''}

          ${this.activeTab === 'control' ? `
            <div id="platform-control-mount"></div>
          ` : ''}

          ${this.activeTab === 'simulator' ? `
            <div class="station-panel">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <span class="survey-label">VIRTUAL PIT STRESS TEST</span>
                  <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-top: 0.2rem;">Offline Safety Simulator</h3>
                </div>
                <button id="run-sim-batch-btn" class="btn-action-primary" style="font-size: 0.78rem; padding: 0.6rem 1.2rem;">
                  <span>RUN VIRTUAL FOG BATCH ▶</span>
                </button>
              </div>

              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.25rem;">
                This simulator stress-tests truck braking scenarios across 5,000 synthetic fog runs without needing live vehicles on the road.
              </p>

              <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-md); padding: 1rem; font-family: var(--font-mono); font-size: 0.78rem;">
                <div style="color: var(--accent-amber); font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
                  <span class="capsule-status-dot"></span> SIMULATION TERMINAL LOG
                </div>
                <pre id="sim-console-output" style="color: var(--text-primary); margin: 0; min-height: 140px; max-height: 220px; overflow-y: auto; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">Click "RUN VIRTUAL FOG BATCH" above to begin synthetic testing...</pre>
              </div>
            </div>
          ` : ''}

        </div>
      </div>
    `;
  }
}
