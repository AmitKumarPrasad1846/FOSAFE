/**
 * FOSAFE Exploded Vehicle Unit Diagram
 * Interactive technical schematic of the rugged vehicle safety computer
 * with connected sensor network, bus traces, and engineering inspector panel.
 */

import { SENSOR_REGISTRY } from '../lib/telemetry.js';
import { appState } from '../lib/state.js';

export class ExplodedVehicleUnit {
  constructor(containerElement) {
    this.container = containerElement;
    this.activeSensor = 'ESP32';
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  selectSensor(sensorKey) {
    if (!SENSOR_REGISTRY[sensorKey]) return;
    this.activeSensor = sensorKey;
    appState.setActiveSensor(sensorKey);
    this.updateInspector();
    this.updateSvgHighlights();
  }

  updateSvgHighlights() {
    const nodes = this.container.querySelectorAll('.sensor-svg-group');
    nodes.forEach(node => {
      const key = node.getAttribute('data-sensor');
      if (key === this.activeSensor) {
        node.classList.add('is-active');
      } else {
        node.classList.remove('is-active');
      }
    });

    const traces = this.container.querySelectorAll('.bus-trace');
    traces.forEach(trace => {
      const key = trace.getAttribute('data-sensor');
      if (key === this.activeSensor) {
        trace.classList.add('is-active');
      } else {
        trace.classList.remove('is-active');
      }
    });

    const buttons = this.container.querySelectorAll('.sensor-selector-pill');
    buttons.forEach(btn => {
      const key = btn.getAttribute('data-sensor');
      if (key === this.activeSensor) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  updateInspector() {
    const data = SENSOR_REGISTRY[this.activeSensor];
    const inspector = this.container.querySelector('.sensor-detail-panel');
    if (!inspector || !data) return;

    inspector.innerHTML = `
      <div class="inspector-header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="telemetry-tag warning" style="margin-bottom: 0.35rem;">SUBSYSTEM // ${data.id}</span>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary);">${data.name}</h3>
          </div>
          <span class="font-mono" style="font-size: 0.75rem; color: var(--accent-amber); font-weight: 700;">${data.interface}</span>
        </div>
        <div class="font-mono" style="font-size: 0.78rem; color: var(--steel-300); margin-bottom: 1rem;">
          CHIPSET: <strong style="color: var(--text-primary);">${data.chipset}</strong>
        </div>
      </div>

      <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 0.85rem; border-radius: var(--radius-xs); margin-bottom: 1rem;">
        <div class="survey-label" style="margin-bottom: 0.35rem; color: var(--accent-amber);">OPERATIONAL ROLE</div>
        <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 0;">${data.purpose}</p>
      </div>

      <table class="sensor-spec-table">
        <tbody>
          <tr>
            <td>UPDATE RATE</td>
            <td>${data.frequency}</td>
          </tr>
          <tr>
            <td>PRECISION / RANGE</td>
            <td>${data.accuracy}</td>
          </tr>
          <tr>
            <td>SUPPLY VOLTAGE</td>
            <td>${data.operatingVoltage}</td>
          </tr>
          ${data.specifications.map(s => `
            <tr>
              <td>${s.label}</td>
              <td>${s.value}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top: 1.2rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <span class="mono-readout" style="font-size: 0.7rem; color: var(--text-muted);">BUS STATUS: LOCKED &amp; SAMPLING</span>
        <span class="telemetry-tag normal"><span class="pulse-dot"></span>ONLINE</span>
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelectorAll('[data-sensor]').forEach(elem => {
      elem.addEventListener('click', () => {
        const key = elem.getAttribute('data-sensor');
        this.selectSensor(key);
      });
      elem.addEventListener('mouseenter', () => {
        const key = elem.getAttribute('data-sensor');
        this.selectSensor(key);
      });
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="exploded-unit-container">
        <!-- Technical SVG Exploded Canvas -->
        <div class="exploded-svg-viewport">
          <svg viewBox="0 0 680 440" width="100%" height="100%" style="overflow: visible;">
            <defs>
              <pattern id="diagGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <line x1="0" y1="20" x2="20" y2="0" stroke="rgba(43, 51, 66, 0.25)" stroke-width="1" />
              </pattern>
              <!-- Glowing Filters -->
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Background Grid -->
            <rect width="680" height="440" fill="#080A0E" />
            <rect width="680" height="440" fill="url(#diagGrid)" />

            <!-- Technical Coordinate Ticks -->
            <g stroke="#232B38" stroke-width="1">
              <line x1="40" y1="20" x2="640" y2="20" />
              <line x1="40" y1="420" x2="640" y2="420" />
              <line x1="40" y1="20" x2="40" y2="420" />
              <line x1="640" y1="20" x2="640" y2="420" />
            </g>

            <!-- Bus Lines connecting sensors to ESP32 (Center: 340, 220) -->
            <!-- ESP32 to GPS (Top: 340, 70) -->
            <path class="bus-trace" data-sensor="GPS" d="M 340 180 L 340 100" stroke="#3D485C" stroke-width="2" stroke-dasharray="4 4" fill="none" />
            
            <!-- ESP32 to ULTRASONIC (Top-Right: 530, 110) -->
            <path class="bus-trace" data-sensor="ULTRASONIC" d="M 390 200 L 460 140 L 510 140" stroke="#3D485C" stroke-width="2" stroke-dasharray="4 4" fill="none" />
            
            <!-- ESP32 to DHT11 (Bottom-Right: 520, 320) -->
            <path class="bus-trace" data-sensor="DHT11" d="M 390 240 L 460 290 L 500 290" stroke="#3D485C" stroke-width="2" stroke-dasharray="4 4" fill="none" />
            
            <!-- ESP32 to MPU6050 (Bottom: 340, 350) -->
            <path class="bus-trace" data-sensor="MPU6050" d="M 340 260 L 340 330" stroke="#3D485C" stroke-width="2" stroke-dasharray="4 4" fill="none" />
            
            <!-- ESP32 to IR (Left: 150, 220) -->
            <path class="bus-trace" data-sensor="IR" d="M 290 220 L 190 220" stroke="#3D485C" stroke-width="2" stroke-dasharray="4 4" fill="none" />

            <!-- CENTER: ESP32 CORE ENCLOSURE -->
            <g class="sensor-svg-group is-active" data-sensor="ESP32" transform="translate(290, 170)" style="cursor: pointer;">
              <!-- Outer Rugged Heat-Sink Case -->
              <rect x="0" y="0" width="100" height="100" rx="4" fill="#141822" stroke="#F59E0B" stroke-width="2" />
              <!-- Heat-sink fins -->
              <line x1="12" y1="8" x2="88" y2="8" stroke="#252D3D" stroke-width="2" />
              <line x1="12" y1="16" x2="88" y2="16" stroke="#252D3D" stroke-width="2" />
              <!-- MCU Die -->
              <rect x="25" y="28" width="50" height="44" rx="2" fill="#0B0D12" stroke="#3D485C" stroke-width="1.5" />
              <text x="50" y="47" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#F59E0B" text-anchor="middle">ESP32</text>
              <text x="50" y="59" font-family="'JetBrains Mono', monospace" font-size="7" fill="#9AA6B8" text-anchor="middle">240MHz DUAL</text>
              <circle cx="50" cy="85" r="3" fill="#10B981" />
              <text x="50" y="96" font-family="'JetBrains Mono', monospace" font-size="6" fill="#10B981" text-anchor="middle">CORE ACTIVE</text>
            </g>

            <!-- SENSOR 1: GPS (TOP) -->
            <g class="sensor-svg-group" data-sensor="GPS" transform="translate(295, 45)" style="cursor: pointer;">
              <rect x="0" y="0" width="90" height="45" rx="3" fill="#11151D" stroke="#3D485C" stroke-width="1.5" />
              <rect x="6" y="6" width="24" height="24" rx="2" fill="#202735" stroke="#F59E0B" stroke-width="1" />
              <circle cx="18" cy="18" r="4" fill="#F59E0B" />
              <text x="36" y="20" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#EDEFEF">GPS / GNSS</text>
              <text x="36" y="32" font-family="'JetBrains Mono', monospace" font-size="7" fill="#7E8899">NEO-6M 10Hz</text>
            </g>

            <!-- SENSOR 2: ULTRASONIC (TOP RIGHT) -->
            <g class="sensor-svg-group" data-sensor="ULTRASONIC" transform="translate(510, 115)" style="cursor: pointer;">
              <rect x="0" y="0" width="120" height="50" rx="3" fill="#11151D" stroke="#3D485C" stroke-width="1.5" />
              <!-- Dual transducer circular horns -->
              <circle cx="25" cy="25" r="14" fill="#1E2533" stroke="#F59E0B" stroke-width="1.5" />
              <circle cx="25" cy="25" r="6" fill="#0B0D12" />
              <circle cx="60" cy="25" r="14" fill="#1E2533" stroke="#F59E0B" stroke-width="1.5" />
              <circle cx="60" cy="25" r="6" fill="#0B0D12" />
              <text x="82" y="24" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#EDEFEF">SONAR</text>
              <text x="82" y="36" font-family="'JetBrains Mono', monospace" font-size="7" fill="#7E8899">40kHz</text>
            </g>

            <!-- SENSOR 3: DHT11 (BOTTOM RIGHT) -->
            <g class="sensor-svg-group" data-sensor="DHT11" transform="translate(500, 270)" style="cursor: pointer;">
              <rect x="0" y="0" width="125" height="50" rx="3" fill="#11151D" stroke="#3D485C" stroke-width="1.5" />
              <!-- Blue perforated plastic grid representation -->
              <rect x="8" y="8" width="28" height="34" rx="2" fill="#1A2D4A" stroke="#3B82F6" stroke-width="1" />
              <line x1="14" y1="14" x2="30" y2="14" stroke="#60A5FA" stroke-width="1.5" />
              <line x1="14" y1="20" x2="30" y2="20" stroke="#60A5FA" stroke-width="1.5" />
              <line x1="14" y1="26" x2="30" y2="26" stroke="#60A5FA" stroke-width="1.5" />
              <line x1="14" y1="32" x2="30" y2="32" stroke="#60A5FA" stroke-width="1.5" />
              <text x="44" y="24" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="#EDEFEF">DHT11 ENV</text>
              <text x="44" y="36" font-family="'JetBrains Mono', monospace" font-size="7" fill="#7E8899">TEMP + HUMID</text>
            </g>

            <!-- SENSOR 4: MPU6050 (BOTTOM) -->
            <g class="sensor-svg-group" data-sensor="MPU6050" transform="translate(290, 335)" style="cursor: pointer;">
              <rect x="0" y="0" width="100" height="50" rx="3" fill="#11151D" stroke="#3D485C" stroke-width="1.5" />
              <rect x="10" y="10" width="30" height="30" rx="1" fill="#0B0D12" stroke="#10B981" stroke-width="1" />
              <text x="25" y="27" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#10B981" text-anchor="middle">6-DOF</text>
              <text x="48" y="24" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="#EDEFEF">MPU6050</text>
              <text x="48" y="36" font-family="'JetBrains Mono', monospace" font-size="7" fill="#7E8899">GYRO/ACCEL</text>
            </g>

            <!-- SENSOR 5: IR ARRAY (LEFT) -->
            <g class="sensor-svg-group" data-sensor="IR" transform="translate(90, 195)" style="cursor: pointer;">
              <rect x="0" y="0" width="100" height="50" rx="3" fill="#11151D" stroke="#3D485C" stroke-width="1.5" />
              <!-- Transmitter & Receiver pair -->
              <circle cx="20" cy="25" r="7" fill="#3B1218" stroke="#EF4444" stroke-width="1.5" />
              <circle cx="38" cy="25" r="7" fill="#15201A" stroke="#10B981" stroke-width="1.5" />
              <text x="52" y="24" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="#EDEFEF">IR BERM</text>
              <text x="52" y="36" font-family="'JetBrains Mono', monospace" font-size="7" fill="#7E8899">38kHz OPTIC</text>
            </g>
          </svg>
        </div>

        <!-- Sensor Technical Inspector -->
        <div class="sensor-detail-panel">
          <!-- Populated dynamically via updateInspector() -->
        </div>
      </div>

      <!-- Quick Switcher Bar -->
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; align-items: center;">
        <span class="data-label" style="margin-right: 0.5rem;">EXPLORE SUBSYSTEM:</span>
        <button class="telemetry-tag sensor-selector-pill is-active" data-sensor="ESP32">ESP32 MCU</button>
        <button class="telemetry-tag sensor-selector-pill" data-sensor="GPS">GPS / GNSS</button>
        <button class="telemetry-tag sensor-selector-pill" data-sensor="ULTRASONIC">ULTRASONIC</button>
        <button class="telemetry-tag sensor-selector-pill" data-sensor="IR">IR BARRIER</button>
        <button class="telemetry-tag sensor-selector-pill" data-sensor="MPU6050">MPU6050 IMU</button>
        <button class="telemetry-tag sensor-selector-pill" data-sensor="DHT11">DHT11 AMBIENT</button>
      </div>
    `;

    // Add SVG active styling
    const styleElem = document.createElement('style');
    styleElem.textContent = `
      .sensor-svg-group {
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .sensor-svg-group:hover, .sensor-svg-group.is-active {
        transform: scale(1.05);
      }
      .sensor-svg-group.is-active rect:first-child {
        stroke: var(--accent-amber) !important;
        stroke-width: 2.5px !important;
      }
      .bus-trace.is-active {
        stroke: var(--accent-amber) !important;
        stroke-width: 2.5px !important;
        stroke-dasharray: none !important;
      }
      .sensor-selector-pill.is-active {
        border-color: var(--accent-amber) !important;
        color: var(--accent-amber) !important;
        background: rgba(245, 158, 11, 0.12) !important;
      }
    `;
    this.container.appendChild(styleElem);

    this.updateInspector();
    this.updateSvgHighlights();
  }
}
