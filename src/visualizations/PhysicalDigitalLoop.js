/**
 * FOSAFE Physical + Digital Demonstrator
 * Interactive hardware-in-the-loop demonstrator:
 * Driver presses physical in-cab FOG ASSIST button -> ESP32 GPIO interrupt ->
 * Status LED -> Telematics packet -> Driver HUD -> Control Room dispatch alert.
 */

import { appState } from '../lib/state.js';

export class PhysicalDigitalLoop {
  constructor(containerElement) {
    this.container = containerElement;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();

    // Subscribe to state
    this.unsubscribe = appState.subscribe((state) => {
      this.updateCircuit(state);
    });
  }

  updateCircuit(state) {
    const btn = this.container.querySelector('#fog-assist-tactile-btn');
    const statusText = this.container.querySelector('#hardware-loop-status-text');
    const led = this.container.querySelector('#esp32-status-led');

    if (btn) {
      if (state.fogAssistPressed) {
        btn.classList.add('is-pressed');
      } else {
        btn.classList.remove('is-pressed');
      }
    }

    if (led) {
      if (state.circuitStep >= 2) {
        led.style.background = '#F59E0B';
        led.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.9)';
      } else {
        led.style.background = '#2B3342';
        led.style.boxShadow = 'none';
      }
    }

    if (statusText) {
      statusText.textContent = state.hardwareLoopStatus;
    }

    // Step items
    this.container.querySelectorAll('.circuit-step-item').forEach(item => {
      const stepNum = parseInt(item.getAttribute('data-step'), 10);
      if (stepNum <= state.circuitStep) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  bindEvents() {
    const btn = this.container.querySelector('#fog-assist-tactile-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        appState.triggerFogAssistButton();
      });
    }
  }

  render() {
    const state = appState.getState();

    this.container.innerHTML = `
      <div class="hardware-loop-display">
        <!-- Left: Interactive Push Button & ESP32 Micro-Mockup -->
        <div class="button-interactive-pod">
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; text-align: center;">
            CABIN SWITCH INTERFACE
          </div>

          <!-- Tactile Hardware Button -->
          <button id="fog-assist-tactile-btn" class="tactile-button ${state.fogAssistPressed ? 'is-pressed' : ''}" aria-label="Press Fog Assist Button">
            <div class="button-cap">
              <span style="font-size: 0.65rem; opacity: 0.85;">PULL / PUSH</span>
              <span style="font-size: 0.85rem; font-weight: 900;">FOG ASSIST</span>
              <span style="font-size: 0.6rem; opacity: 0.85;">PRESS ME</span>
            </div>
          </button>

          <!-- ESP32 Board Mockup with Status LED -->
          <div style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 0.5rem 0.85rem; border-radius: var(--radius-xs); margin-top: 0.5rem;">
            <div id="esp32-status-led" style="width: 12px; height: 12px; border-radius: 50%; background: #2B3342; transition: all 0.2s ease; border: 1px solid var(--line-strong);"></div>
            <div style="display: flex; flex-direction: column;">
              <span class="font-mono" style="font-size: 0.72rem; color: var(--text-primary); font-weight: 700;">GPIO 18 / STATUS LED</span>
              <span class="small-mono" style="font-size: 0.65rem; color: var(--text-muted);">ESP32 ON-BOARD INTERRUPT</span>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Propagation Chain -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.5rem;">
            <span class="survey-label" style="color: var(--accent-amber);">PHYSICAL-TO-DIGITAL BRIDGE</span>
            <span id="hardware-loop-status-text" class="font-mono" style="font-size: 0.72rem; color: var(--text-primary);">
              ${state.hardwareLoopStatus}
            </span>
          </div>

          <div class="circuit-step-list">
            <div class="circuit-step-item ${state.circuitStep >= 1 ? 'is-active' : ''}" data-step="1">
              <div class="circuit-step-dot">1</div>
              <div>
                <strong style="font-family: var(--font-display); font-size: 0.88rem; color: var(--text-primary);">Driver presses physical FOG ASSIST button</strong>
                <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                  Cab momentary push-button completes circuit; drops GPIO 18 to GND with hardware RC debouncing.
                </p>
              </div>
            </div>

            <div class="circuit-step-item ${state.circuitStep >= 2 ? 'is-active' : ''}" data-step="2">
              <div class="circuit-step-dot">2</div>
              <div>
                <strong style="font-family: var(--font-display); font-size: 0.88rem; color: var(--text-primary);">ESP32 Interrupt ISR &amp; Hardware Status LED</strong>
                <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                  Core 1 triggers interrupt in &lt;4µs, illuminating amber feedback LED and firing external beacon strobe relay.
                </p>
              </div>
            </div>

            <div class="circuit-step-item ${state.circuitStep >= 3 ? 'is-active' : ''}" data-step="3">
              <div class="circuit-step-dot">3</div>
              <div>
                <strong style="font-family: var(--font-display); font-size: 0.88rem; color: var(--text-primary);">Telemetry Packet Dispatched via MQTT</strong>
                <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                  Edge unit transmits payload (vehicle ID, GNSS coordinates, relative humidity, hazard flag) over 868MHz / LTE.
                </p>
              </div>
            </div>

            <div class="circuit-step-item ${state.circuitStep >= 4 ? 'is-active' : ''}" data-step="4">
              <div class="circuit-step-dot">4</div>
              <div>
                <strong style="font-family: var(--font-display); font-size: 0.88rem; color: var(--text-primary);">In-Cab Driver Safety Dashboard Updates</strong>
                <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                  Driver interface transitions into dense fog radar mode; radar radius expands and audio alerts activate.
                </p>
              </div>
            </div>

            <div class="circuit-step-item ${state.circuitStep >= 5 ? 'is-active' : ''}" data-step="5">
              <div class="circuit-step-dot">5</div>
              <div>
                <strong style="font-family: var(--font-display); font-size: 0.88rem; color: var(--text-primary);">Mine Control Room Dispatch Alert Logs</strong>
                <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                  Central dispatcher tactical map flags Unit D-07 and broadcasts visibility advisory to approaching haulers.
                </p>
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
