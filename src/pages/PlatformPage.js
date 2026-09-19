/**
 * FOSAFE PlatformPage
 * Unified platform interface showing Driver Console, Control Room,
 * and Simulation Environment with rigorous data provenance separation.
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
      <div style="padding: var(--space-12) 0 var(--space-20);">
        <div class="container">
          <!-- Page Header -->
          <div style="margin-bottom: var(--space-8);">
            <div class="section-eyebrow">
              <span class="pulse-dot"></span>
              <span>UNIFIED SOFTWARE ARCHITECTURE</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #EDEFEF; text-transform: uppercase;">
              FOSAFE PLATFORM SUITE
            </h1>
            <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 780px; margin-top: 0.75rem; line-height: 1.6;">
              Inspect the three operational tiers of the FOSAFE ecosystem: the in-cab driver safety terminal, the central dispatch control room, and the offline simulation sandbox.
            </p>
          </div>

          <!-- Platform Tab Navigation -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem;">
            <button class="btn-instrument ${this.activeTab === 'driver' ? 'is-active' : ''}" data-platform-tab="driver" style="${this.activeTab === 'driver' ? 'border-color: var(--accent-amber); color: #fff;' : ''}">
              01 // DRIVER SAFETY CONSOLE
            </button>
            <button class="btn-instrument ${this.activeTab === 'control' ? 'is-active' : ''}" data-platform-tab="control" style="${this.activeTab === 'control' ? 'border-color: var(--accent-amber); color: #fff;' : ''}">
              02 // MINE CONTROL ROOM
            </button>
            <button class="btn-instrument ${this.activeTab === 'simulator' ? 'is-active' : ''}" data-platform-tab="simulator" style="${this.activeTab === 'simulator' ? 'border-color: var(--accent-amber); color: #fff;' : ''}">
              03 // SIMULATION ENVIRONMENT
            </button>
          </div>

          <!-- Tab Content Display -->
          ${this.activeTab === 'driver' ? `
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: #EDEFEF;">In-Cab Heavy Vehicle Terminal</h3>
                  <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">Direct operator interface running on local hardware. 360-degree radar proximity and dynamic braking alarms.</p>
                </div>
                <span class="provenance-tag live">LIVE HARDWARE INTERFACE</span>
              </div>
              <div id="platform-driver-mount"></div>
            </div>
          ` : ''}

          ${this.activeTab === 'control' ? `
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: #EDEFEF;">Central Mine Dispatcher Console</h3>
                  <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">Centralized radar map tracking all active haulage units, active fog assist flags, and bench risk indices.</p>
                </div>
                <span class="provenance-tag sim">SIMULATION // DISPATCH CONSOLE</span>
              </div>
              <div id="platform-control-mount"></div>
            </div>
          ` : ''}

          ${this.activeTab === 'simulator' ? `
            <div>
              <!-- SIMULATION WATERMARK NOTICE -->
              <div style="background: var(--badge-sim-bg); border: 1px dashed var(--badge-sim-border); padding: 1rem; border-radius: var(--radius-xs); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span class="provenance-tag sim">SYNTHETIC ENVIRONMENT</span>
                  <div>
                    <strong style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--accent-amber);">OFFLINE SYNTHETIC SIMULATION SANDBOX</strong>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">
                      NOTICE: All data displayed below is synthetically modeled. It does not represent active mining hardware or physical vehicle telemetries.
                    </div>
                  </div>
                </div>
                <span class="provenance-tag sim">SYNTHETIC MODEL ONLY</span>
              </div>

              <div class="tech-panel">
                <div class="tech-header">
                  <span class="tech-title">MONTE CARLO TRAFFIC &amp; FOG STRESS ENGINE</span>
                  <button id="run-sim-batch-btn" class="btn btn-primary btn-sm">▶ RUN SYNTHETIC SCENARIO</button>
                </div>

                <div class="industrial-grid industrial-grid-3" style="margin-bottom: 1.5rem;">
                  <div class="metric-box">
                    <span class="metric-label">VIRTUAL VEHICLES SPAWNED</span>
                    <div class="val-row">
                      <span class="metric-value" style="color: #93C5FD;">24</span>
                      <span class="metric-unit">UNITS</span>
                    </div>
                  </div>
                  <div class="metric-box">
                    <span class="metric-label">MODELED FOG DENSITY</span>
                    <div class="val-row">
                      <span class="metric-value" style="color: var(--accent-amber);">94.2</span>
                      <span class="metric-unit">%</span>
                    </div>
                  </div>
                  <div class="metric-box">
                    <span class="metric-label">PREVENTED CONFLICTS</span>
                    <div class="val-row">
                      <span class="metric-value" style="color: var(--status-normal);">100</span>
                      <span class="metric-unit">%</span>
                    </div>
                  </div>
                </div>

                <div class="data-label" style="margin-bottom: 0.35rem;">SIMULATION KERNEL LOG OUTPUT:</div>
                <pre id="sim-console-output" style="background: #07090C; border: 1px solid var(--border-subtle); padding: 1rem; border-radius: var(--radius-xs); font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.6; color: #93C5FD; height: 180px; overflow-y: auto;">
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
