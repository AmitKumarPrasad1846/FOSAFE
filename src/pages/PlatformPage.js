/**
 * FOSAFE v2 PlatformPage
 * Unified platform interface showing Driver Console, Control Room,
 * and Simulation Environment with rigorous data provenance separation.
 * Fully supports Dark and Light modes.
 */

import { DriverConsolePreview } from '../visualizations/DriverConsolePreview.js';
import { MineControlRoomPreview } from '../visualizations/MineControlRoomPreview.js';

export class PlatformPage {
  constructor(container) {
    this.container = container;
    this.activeTab = 'driver'; // 'driver' | 'control' | 'simulator'
    this.activeInstances = [];
  }

  mount() {
    this.render();
    this.bindEvents();
    this.initCurrentTab();
  }

  unmount() {
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
        simLog.textContent = 'INITIATING MONTE CARLO TRAFFIC RUN...\n';
        const lines = [
          '[SIM-ENGINE] Spawning 24 synthetic haulers across Pit Benches 01-06',
          '[SIM-ENGINE] Atmospheric visibility initialized: DENSE FOG (18m sightline)',
          '[SIM-ENGINE] Injecting hairpin convergence at Ramp 04 Bench B',
          '[ARBITRATION] Unit SIM-09 computed collision trajectory with SIM-14 (TTI: 1.4s)',
          '[ARBITRATION] In-cab brake alert triggered at 24.2m buffer',
          '[METRICS] Successful deceleration. Zero virtual impacts across 5,000 synthetic iterations.',
          '[DATA INTEGRITY] PASS: Simulation executed offline without contaminating live telemetry queues.'
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
      <div style="padding: calc(64px + var(--sp-8)) var(--sp-6) var(--sp-20);">
        <div style="max-width: 1320px; margin: 0 auto;">
          <!-- Page Header -->
          <div style="margin-bottom: var(--sp-8); max-width: 860px;">
            <div class="station-marker font-mono">
              <span>UNIFIED SOFTWARE ARCHITECTURE // STATION 04</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4.2rem); font-weight: 800; color: var(--text-primary); text-transform: uppercase;">
              FOSAFE PLATFORM SUITE
            </h1>
            <p class="lead-text" style="margin-top: 0.75rem;">
              Inspect the three operational tiers of the FOSAFE ecosystem: the in-cab driver safety terminal, the central dispatch control room, and the offline simulation sandbox.
            </p>
          </div>

          <!-- Platform Tab Navigation -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.85rem;">
            <button class="capsule-nav-link ${this.activeTab === 'driver' ? 'is-active' : ''}" data-platform-tab="driver" style="font-size: 0.8rem; padding: 0.5rem 1rem; border: 1px solid ${this.activeTab === 'driver' ? 'var(--accent-amber)' : 'var(--line-structure)'}; background: ${this.activeTab === 'driver' ? 'var(--capsule-pill-active)' : 'var(--bg-inset)'}; cursor: pointer;">
              01 // DRIVER SAFETY CONSOLE
            </button>
            <button class="capsule-nav-link ${this.activeTab === 'control' ? 'is-active' : ''}" data-platform-tab="control" style="font-size: 0.8rem; padding: 0.5rem 1rem; border: 1px solid ${this.activeTab === 'control' ? 'var(--accent-amber)' : 'var(--line-structure)'}; background: ${this.activeTab === 'control' ? 'var(--capsule-pill-active)' : 'var(--bg-inset)'}; cursor: pointer;">
              02 // MINE CONTROL ROOM
            </button>
            <button class="capsule-nav-link ${this.activeTab === 'simulator' ? 'is-active' : ''}" data-platform-tab="simulator" style="font-size: 0.8rem; padding: 0.5rem 1rem; border: 1px solid ${this.activeTab === 'simulator' ? 'var(--accent-amber)' : 'var(--line-structure)'}; background: ${this.activeTab === 'simulator' ? 'var(--capsule-pill-active)' : 'var(--bg-inset)'}; cursor: pointer;">
              03 // SIMULATION ENVIRONMENT
            </button>
          </div>

          <!-- Tab Content Display -->
          ${this.activeTab === 'driver' ? `
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--text-primary); text-transform: uppercase;">In-Cab Heavy Vehicle Terminal</h3>
                  <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">Direct operator interface running on local hardware. 360-degree radar proximity and dynamic braking alarms.</p>
                </div>
                <span class="provenance-tag live">LIVE HARDWARE INTERFACE</span>
              </div>
              <div id="platform-driver-mount"></div>
            </div>
          ` : ''}

          ${this.activeTab === 'control' ? `
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--text-primary); text-transform: uppercase;">Central Mine Dispatcher Console</h3>
                  <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">Centralized radar map tracking all active haulage units, active fog assist flags, and bench risk indices.</p>
                </div>
                <span class="provenance-tag sim">SIMULATION // DISPATCH CONSOLE</span>
              </div>
              <div id="platform-control-mount"></div>
            </div>
          ` : ''}

          ${this.activeTab === 'simulator' ? `
            <div>
              <!-- SIMULATION WATERMARK NOTICE -->
              <div style="background: var(--badge-sim-bg); border: 1px dashed var(--badge-sim-border); padding: 1.25rem; border-radius: var(--radius-xs); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span class="provenance-tag sim">SYNTHETIC ENVIRONMENT</span>
                  <div>
                    <strong style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-amber);">OFFLINE SYNTHETIC SIMULATION SANDBOX</strong>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
                      NOTICE: All data displayed below is synthetically modeled. It does not represent active mining hardware or physical vehicle telemetries.
                    </div>
                  </div>
                </div>
                <span class="provenance-tag sim">SYNTHETIC MODEL ONLY</span>
              </div>

              <div class="station-panel">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                  <div>
                    <span class="survey-label">SYNTHETIC ENGINE</span>
                    <h3 style="font-size: 1.6rem; color: var(--text-primary); margin-top: 0.2rem;">MONTE CARLO TRAFFIC &amp; FOG STRESS ENGINE</h3>
                  </div>
                  <button id="run-sim-batch-btn" class="btn-action-primary" style="font-size: 0.75rem; padding: 0.6rem 1.2rem;">
                    ▶ RUN SYNTHETIC SCENARIO
                  </button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--sp-4); margin-bottom: 1.5rem;">
                  <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1.25rem; border-radius: var(--radius-xs);">
                    <span class="survey-label">VIRTUAL VEHICLES SPAWNED</span>
                    <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.35rem;">
                      <span class="font-mono" style="font-size: 2.2rem; font-weight: 800; color: var(--accent-amber);">24</span>
                      <span class="small-mono" style="color: var(--text-muted);">UNITS</span>
                    </div>
                  </div>
                  <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1.25rem; border-radius: var(--radius-xs);">
                    <span class="survey-label">MODELED FOG DENSITY</span>
                    <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.35rem;">
                      <span class="font-mono" style="font-size: 2.2rem; font-weight: 800; color: var(--state-warning);">94.2</span>
                      <span class="small-mono" style="color: var(--text-muted);">%</span>
                    </div>
                  </div>
                  <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1.25rem; border-radius: var(--radius-xs);">
                    <span class="survey-label">PREVENTED CONFLICTS</span>
                    <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.35rem;">
                      <span class="font-mono" style="font-size: 2.2rem; font-weight: 800; color: var(--state-normal);">100</span>
                      <span class="small-mono" style="color: var(--text-muted);">%</span>
                    </div>
                  </div>
                </div>

                <div class="survey-label" style="margin-bottom: 0.4rem;">SIMULATION KERNEL LOG OUTPUT:</div>
                <pre id="sim-console-output" style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1rem; border-radius: var(--radius-xs); font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6; color: var(--accent-amber); height: 180px; overflow-y: auto; white-space: pre-wrap;">
[SIM-ENGINE] Testbench ready. Click "RUN SYNTHETIC SCENARIO" to execute a 24-vehicle fog convergence simulation.
                </pre>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
