/**
 * FOSAFE Low-Visibility Intelligence Simulator
 * Interactive atmospheric degradation demonstration: CLEAR -> LOW VISIBILITY -> DENSE FOG
 * Demonstrates safety buffer expansion and radar penetration through heavy radiation fog.
 */

import { VISIBILITY_STATES } from '../lib/telemetry.js';
import { appState } from '../lib/state.js';

export class VisibilitySimulator {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentMode = appState.getState().visibilityMode || 'LOW_VISIBILITY';
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();

    // Subscribe to state changes
    this.unsubscribe = appState.subscribe((state) => {
      if (state.visibilityMode !== this.currentMode) {
        this.currentMode = state.visibilityMode;
        this.updateView();
      }
    });
  }

  setMode(modeKey) {
    if (!VISIBILITY_STATES[modeKey]) return;
    this.currentMode = modeKey;
    appState.setVisibilityMode(modeKey);
    this.updateView();
  }

  updateView() {
    const data = VISIBILITY_STATES[this.currentMode];
    if (!data) return;

    // Update buttons
    this.container.querySelectorAll('.vis-step-btn').forEach(btn => {
      const mode = btn.getAttribute('data-mode');
      if (mode === this.currentMode) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // Update camera shroud
    const shroud = this.container.querySelector('.camera-fog-shroud');
    if (shroud) {
      shroud.style.opacity = data.fogDensityValue;
    }

    // Update radar penetration hud
    const hudRadar = this.container.querySelector('.vis-penetration-hud');
    if (hudRadar) {
      hudRadar.style.borderColor = data.hudColor;
    }

    // Update metrics
    const rangeVal = this.container.querySelector('#vis-sightline-val');
    const radiusVal = this.container.querySelector('#vis-safety-radius-val');
    const speedVal = this.container.querySelector('#vis-speed-advisory-val');
    const descText = this.container.querySelector('#vis-mode-desc');

    if (rangeVal) rangeVal.textContent = data.visibilityRange;
    if (radiusVal) {
      radiusVal.textContent = data.safetyRadius;
      radiusVal.style.color = data.hudColor;
    }
    if (speedVal) speedVal.textContent = data.speedAdvisory;
    if (descText) descText.textContent = data.description;
  }

  bindEvents() {
    this.container.querySelectorAll('.vis-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        this.setMode(mode);
      });
    });
  }

  render() {
    const active = VISIBILITY_STATES[this.currentMode];

    this.container.innerHTML = `
      <div class="visibility-sim-shell">
        <!-- 3-State Stepper Controls -->
        <div class="visibility-stepper">
          <button class="vis-step-btn ${this.currentMode === 'CLEAR' ? 'is-active' : ''}" data-mode="CLEAR">
            <span>MODE 01 // CLEAR</span>
            <span class="vis-tag">1000m+ Sightline • Standard Op</span>
          </button>
          <button class="vis-step-btn ${this.currentMode === 'LOW_VISIBILITY' ? 'is-active' : ''}" data-mode="LOW_VISIBILITY">
            <span>MODE 02 // LOW VISIBILITY</span>
            <span class="vis-tag">80-150m Sightline • Buffer Expands</span>
          </button>
          <button class="vis-step-btn ${this.currentMode === 'DENSE_FOG' ? 'is-active' : ''}" data-mode="DENSE_FOG">
            <span>MODE 03 // DENSE FOG</span>
            <span class="vis-tag">&lt;30m Zero Sightline • Radar Enforced</span>
          </button>
        </div>

        <!-- Stage Display: In-Cab Optical View vs FOSAFE Telemetric HUD -->
        <div class="vis-display-stage">
          <!-- Windscreen Simulation Box -->
          <div class="vis-camera-box">
            <!-- Simulated Haul Road Perspective (Background SVG) -->
            <svg viewBox="0 0 500 320" width="100%" height="100%" preserveAspectRatio="none" style="position: absolute; inset: 0;">
              <!-- Sky / Pit Horizon -->
              <rect width="500" height="160" fill="#0A0D12" />
              <!-- Pit Bench Rim -->
              <polygon points="0,150 120,135 320,145 500,130 500,160 0,160" fill="#141822" />
              <!-- Road Surface -->
              <polygon points="0,320 500,320 360,160 220,160" fill="#181E29" />
              <!-- Road Center Dashes -->
              <line x1="290" y1="160" x2="250" y2="320" stroke="#F59E0B" stroke-width="3" stroke-dasharray="12 16" />
              <!-- Right Berm -->
              <polygon points="360,160 500,320 500,320 400,160" fill="#121620" />

              <!-- Distant Haul Truck Silhouette (Cat 797 ahead) -->
              <g id="distant-truck" transform="translate(260, 162)">
                <!-- Truck Body -->
                <rect x="-24" y="-22" width="48" height="28" fill="#202735" stroke="#364052" stroke-width="1.5" />
                <rect x="-18" y="-34" width="36" height="12" fill="#181E29" stroke="#364052" stroke-width="1" />
                <!-- Tail Lights -->
                <circle cx="-16" cy="-4" r="2.5" fill="#EF4444" />
                <circle cx="16" cy="-4" r="2.5" fill="#EF4444" />
                <!-- Massive Rear Haul Tires -->
                <rect x="-30" y="-12" width="8" height="18" fill="#0E1117" />
                <rect x="22" y="-12" width="8" height="18" fill="#0E1117" />
              </g>
            </svg>

            <!-- ATMOSPHERIC FOG SHROUD (Opacity adjusts dynamically) -->
            <div class="camera-fog-shroud" style="position: absolute; inset: 0; background: radial-gradient(circle at 55% 45%, rgba(45, 55, 70, 0.96) 0%, rgba(26, 33, 44, 0.98) 75%); opacity: ${active.fogDensityValue}; transition: opacity 0.4s ease; pointer-events: none;"></div>

            <!-- FOSAFE PENETRATION HUD OVERLAY -->
            <div class="vis-penetration-hud" style="position: absolute; inset: 12px; border: 1px solid ${active.hudColor}; border-radius: var(--radius-xs); pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; padding: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="telemetry-tag" style="background: rgba(11, 13, 18, 0.85); font-size: 0.68rem;">CAB HUD // SENSOR FUSION ACTIVE</span>
                <span class="mono-readout" style="font-size: 0.7rem; color: #fff; background: rgba(11, 13, 18, 0.85); padding: 2px 6px;">RADAR: PULSING 40kHz</span>
              </div>

              <!-- Reticle locking on forward truck through fog -->
              <div style="align-self: center; display: flex; flex-direction: column; align-items: center; gap: 4px; transform: translateY(-8px);">
                <div style="width: 70px; height: 50px; border: 2px dashed ${active.hudColor}; border-radius: 2px; display: flex; align-items: center; justify-content: center; background: rgba(245, 158, 11, 0.06);">
                  <div style="width: 6px; height: 6px; background: ${active.hudColor};"></div>
                </div>
                <div style="background: rgba(11, 13, 18, 0.9); padding: 2px 8px; border: 1px solid ${active.hudColor}; font-family: var(--font-mono); font-size: 0.68rem; color: #EDEFEF;">
                  TARGET TRUCK // 08.4 m
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); background: rgba(11, 13, 18, 0.85); padding: 2px 6px;">
                  SIGHTLINE STATUS: <strong style="color: #fff;">${this.currentMode}</strong>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: ${active.hudColor}; background: rgba(11, 13, 18, 0.85); padding: 2px 6px;">
                  ACOUSTIC SONAR: PENETRATING
                </div>
              </div>
            </div>
          </div>

          <!-- Technical Safety Buffer Metrics -->
          <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
            <div class="metric-box" style="border-left: 3px solid ${active.hudColor};">
              <span class="metric-label">DYNAMIC SAFETY PERIMETER BUFFER</span>
              <div class="val-row">
                <span id="vis-safety-radius-val" class="metric-value" style="color: ${active.hudColor};">${active.safetyRadius}</span>
              </div>
              <span class="body-small" style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.2rem;">
                Expands automatically as visual reference drops below critical threshold.
              </span>
            </div>

            <div class="metric-box">
              <span class="metric-label">ESTIMATED DRIVER SIGHTLINE</span>
              <div class="val-row">
                <span id="vis-sightline-val" class="metric-value" style="font-size: 1.3rem;">${active.visibilityRange}</span>
              </div>
              <span class="body-small" style="font-size: 0.75rem; color: var(--text-dim);">
                Standard human visual line-of-sight in active pit bench.
              </span>
            </div>

            <div class="metric-box">
              <span class="metric-label">FLEET SPEED ADVISORY LIMIT</span>
              <div class="val-row">
                <span id="vis-speed-advisory-val" class="metric-value" style="font-size: 1.3rem;">${active.speedAdvisory}</span>
              </div>
            </div>

            <!-- Engineering Disclosure Note -->
            <div style="background: #090B0F; border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: var(--radius-xs);">
              <div class="data-label" style="color: var(--steel-300); margin-bottom: 0.25rem;">TECHNICAL ARCHITECTURE NOTE</div>
              <p id="vis-mode-desc" style="font-size: 0.78rem; line-height: 1.45; color: var(--text-secondary);">
                ${active.description}
              </p>
              <div style="margin-top: 0.4rem; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim);">
                DHT11 provides ambient relative humidity / condensation baseline. Operational modes enforce deterministic stopping envelopes.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
