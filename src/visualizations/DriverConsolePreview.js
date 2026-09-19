/**
 * FOSAFE Driver Safety Console Preview
 * Realistic ruggedized in-cab dashboard display for ultra-class haul truck operators.
 * Real-time proximity radar, collision risk arbitration, and tactile test bench.
 */

import { FLEET_VEHICLES } from '../lib/telemetry.js';
import { ticker } from '../lib/ticker.js';

export class DriverConsolePreview {
  constructor(containerElement) {
    this.container = containerElement;
    this.vehicle = FLEET_VEHICLES[0]; // D-07
    this.distance = 8.4;
    this.simulatedState = 'warning'; // 'normal' | 'warning' | 'critical'
    this.radarAngle = 0;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.startRadarAnimation();
  }

  setDistance(dist) {
    this.distance = dist;
    if (dist <= 5.5) {
      this.simulatedState = 'critical';
    } else if (dist <= 15.0) {
      this.simulatedState = 'warning';
    } else {
      this.simulatedState = 'normal';
    }
    this.updateDisplay();
  }

  startRadarAnimation() {
    ticker.add('driver_console_sweep', (delta) => {
      this.radarAngle = (this.radarAngle + 0.12 * delta) % 360;
      const radarNeedle = this.container.querySelector('#cab-radar-sweep');
      if (radarNeedle) {
        radarNeedle.setAttribute('transform', `rotate(${this.radarAngle} 150 140)`);
      }
    });
  }

  updateDisplay() {
    // Distance text
    const distElem = this.container.querySelector('#cab-dist-val');
    const riskElem = this.container.querySelector('#cab-risk-badge');
    const bannerElem = this.container.querySelector('#cab-alert-banner');
    const targetBlip = this.container.querySelector('#cab-target-blip');

    const formattedDist = this.distance < 10 ? `0${this.distance.toFixed(1)}` : this.distance.toFixed(1);

    if (distElem) {
      distElem.textContent = formattedDist;
    }

    if (this.simulatedState === 'critical') {
      if (riskElem) {
        riskElem.className = 'telemetry-tag critical';
        riskElem.innerHTML = '<span class="pulse-dot"></span>CRITICAL RISK // BRAKE NOW';
      }
      if (bannerElem) {
        bannerElem.className = 'driver-alert-banner state-critical';
        bannerElem.innerHTML = `
          <span>⚠️ EMERGENCY COLLISION HAZARD // DISTANCE ${formattedDist}m</span>
          <span class="mono-readout" style="font-size: 0.75rem;">DECELERATION MANDATED</span>
        `;
      }
      if (targetBlip) {
        targetBlip.setAttribute('fill', '#EF4444');
        targetBlip.setAttribute('cy', '85'); // closer to center
      }
    } else if (this.simulatedState === 'warning') {
      if (riskElem) {
        riskElem.className = 'telemetry-tag warning';
        riskElem.innerHTML = '<span class="pulse-dot"></span>MEDIUM RISK // APPROACHING';
      }
      if (bannerElem) {
        bannerElem.className = 'driver-alert-banner state-warning';
        bannerElem.innerHTML = `
          <span>⚡ PROXIMITY ADVISORY // FORWARD VEHICLE DETECTED (${formattedDist}m)</span>
          <span class="mono-readout" style="font-size: 0.75rem;">REDUCE SPEED TO 15 KM/H</span>
        `;
      }
      if (targetBlip) {
        targetBlip.setAttribute('fill', '#F59E0B');
        targetBlip.setAttribute('cy', '65');
      }
    } else {
      if (riskElem) {
        riskElem.className = 'telemetry-tag normal';
        riskElem.innerHTML = '<span class="pulse-dot"></span>SAFE PERIMETER';
      }
      if (bannerElem) {
        bannerElem.className = 'driver-alert-banner state-normal';
        bannerElem.innerHTML = `
          <span>✓ HAUL CORRIDOR CLEAR // MAINTAIN STANDARD BUFFER</span>
          <span class="mono-readout" style="font-size: 0.75rem;">CRUISE PERMITTED</span>
        `;
      }
      if (targetBlip) {
        targetBlip.setAttribute('fill', '#10B981');
        targetBlip.setAttribute('cy', '35'); // far out
      }
    }
  }

  bindEvents() {
    this.container.querySelectorAll('[data-test-dist]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.getAttribute('data-test-dist'));
        this.setDistance(val);
      });
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="driver-console-frame">
        <!-- Rugged Hardware Bezel Top Bar -->
        <div class="console-bezel-header">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="display: inline-block; width: 8px; height: 8px; background: #F59E0B; border-radius: 50%;"></span>
            <strong style="color: #EDEFEF; letter-spacing: 0.05em;">CAB DISPLAY // UNIT D-07</strong>
            <span style="color: var(--text-dim);">|</span>
            <span style="color: var(--text-muted);">CAT 797F HEAVY HAUL</span>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span class="mono-readout" style="color: var(--steel-300);">RAMP 04 // +7.4% GRADE</span>
            <span class="provenance-tag sim">PREVIEW // COCKPIT HUD</span>
          </div>
        </div>

        <!-- Main In-Cab Layout -->
        <div class="console-grid">
          <!-- Left: 360-Degree Proximity Radar Screen -->
          <div class="proximity-radar-dial">
            <svg viewBox="0 0 300 280" width="100%" height="100%">
              <defs>
                <radialGradient id="radarSweepGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="rgba(245, 158, 11, 0.25)" />
                  <stop offset="100%" stop-color="rgba(245, 158, 11, 0)" />
                </radialGradient>
              </defs>

              <!-- Radar Circles (10m, 25m, 50m) -->
              <circle cx="150" cy="140" r="110" fill="none" stroke="#212836" stroke-width="1" />
              <circle cx="150" cy="140" r="75" fill="none" stroke="#2A3447" stroke-width="1" stroke-dasharray="3 3" />
              <circle cx="150" cy="140" r="40" fill="none" stroke="#414E66" stroke-width="1.5" />

              <!-- Crosshairs -->
              <line x1="40" y1="140" x2="260" y2="140" stroke="#1A212D" stroke-width="1" />
              <line x1="150" y1="30" x2="150" y2="250" stroke="#1A212D" stroke-width="1" />

              <!-- Rotating Radar Sweep Line -->
              <g id="cab-radar-sweep">
                <line x1="150" y1="140" x2="150" y2="30" stroke="#F59E0B" stroke-width="1.5" opacity="0.7" />
              </g>

              <!-- Our Vehicle (Center) -->
              <polygon points="150,132 144,148 156,148" fill="#EDEFEF" />
              <circle cx="150" cy="140" r="2.5" fill="#0B0D12" />

              <!-- Forward Target Vehicle Blip (Approaching) -->
              <circle id="cab-target-blip" cx="150" cy="65" r="6" fill="#F59E0B" />
              <circle cx="150" cy="65" r="12" fill="none" stroke="#F59E0B" stroke-width="1" stroke-dasharray="2 2" />
              <text x="165" y="68" font-family="'JetBrains Mono', monospace" font-size="8" fill="#EDEFEF">D-12 (KOMATSU)</text>

              <!-- Range Markers -->
              <text x="154" y="44" font-family="'JetBrains Mono', monospace" font-size="7" fill="#627084">50m</text>
              <text x="154" y="79" font-family="'JetBrains Mono', monospace" font-size="7" fill="#627084">25m</text>
              <text x="154" y="114" font-family="'JetBrains Mono', monospace" font-size="7" fill="#627084">10m</text>
            </svg>
          </div>

          <!-- Right: Telemetry & Collision Arbitration Cards -->
          <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
            <!-- Distance Big Readout -->
            <div class="metric-box" style="background: #090B0F; border: 1px solid var(--border-medium); padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span class="data-label">FORWARD OBSTACLE DISTANCE</span>
                <span id="cab-risk-badge" class="telemetry-tag warning"><span class="pulse-dot"></span>MEDIUM RISK</span>
              </div>
              <div class="val-row" style="align-items: baseline;">
                <span id="cab-dist-val" style="font-family: var(--font-mono); font-size: 2.8rem; font-weight: 800; color: #EDEFEF; line-height: 1;">08.4</span>
                <span style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--accent-amber); font-weight: 700; margin-left: 0.35rem;">METERS</span>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); margin-top: 0.35rem;">
                CLOSING VELOCITY: <strong style="color: #EDEFEF;">+4.2 km/h</strong> | ACOUSTIC SONAR CONFIRMED
              </div>
            </div>

            <!-- Cab Contextual Telemetries -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <div class="metric-box" style="padding: 0.6rem;">
                <span class="data-label" style="font-size: 0.62rem;">GROUND SPEED</span>
                <div class="val-row">
                  <span class="metric-value" style="font-size: 1.25rem;">18.4</span>
                  <span class="metric-unit">km/h</span>
                </div>
              </div>
              <div class="metric-box" style="padding: 0.6rem;">
                <span class="data-label" style="font-size: 0.62rem;">BRAKE LINE PRESSURE</span>
                <div class="val-row">
                  <span class="metric-value" style="font-size: 1.25rem;">142</span>
                  <span class="metric-unit">PSI</span>
                </div>
              </div>
            </div>

            <!-- Fog Assist Beacon Status -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: #11151D; border: 1px solid var(--border-subtle); padding: 0.6rem 0.85rem; border-radius: var(--radius-xs);">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-amber);"></span>
                <span class="data-label" style="color: var(--text-secondary); font-size: 0.72rem;">FOG ASSIST BEACON:</span>
              </div>
              <span class="mono-readout" style="font-size: 0.75rem; color: var(--accent-amber); font-weight: 700;">ENGAGED (PULSING)</span>
            </div>
          </div>
        </div>

        <!-- In-Cab Active Alert Banner -->
        <div id="cab-alert-banner" class="driver-alert-banner state-warning">
          <span>⚡ PROXIMITY ADVISORY // FORWARD VEHICLE DETECTED (08.4m)</span>
          <span class="mono-readout" style="font-size: 0.75rem;">REDUCE SPEED TO 15 KM/H</span>
        </div>

        <!-- Interactive Driver Console Test Bench -->
        <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid #1F2531; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem;">
          <span class="data-label" style="color: var(--text-muted);">SIMULATE IN-CAB PROXIMITY EVENTS:</span>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-outline btn-sm" data-test-dist="38.0">CLEAR ROAD (38.0m)</button>
            <button class="btn btn-outline btn-sm" data-test-dist="8.4" style="border-color: rgba(245,158,11,0.5); color: #F59E0B;">WARNING (08.4m)</button>
            <button class="btn btn-danger btn-sm" data-test-dist="3.8">EMERGENCY (03.8m)</button>
          </div>
        </div>
      </div>
    `;
  }

  destroy() {
    ticker.remove('driver_console_sweep');
  }
}
