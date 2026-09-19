/**
 * FOSAFE v2 Mine Control Room Preview
 * Centralized fleet-monitoring dispatcher tactical console.
 * Interactive haul-road pit radar map, fleet telemetry table, and live incident log.
 * Fully supports Dark and Light modes.
 */

import { FLEET_VEHICLES } from '../lib/telemetry.js';
import { appState } from '../lib/state.js';

export class MineControlRoomPreview {
  constructor(containerElement) {
    this.container = containerElement;
    this.activeVehicleId = 'D-07';
    this.filter = 'all';
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  selectVehicle(id) {
    this.activeVehicleId = id;
    appState.setActiveVehicle(id);
    this.updateSelection();
  }

  setFilter(filter) {
    this.filter = filter;
    this.updateRosterList();
  }

  updateSelection() {
    const veh = FLEET_VEHICLES.find(v => v.id === this.activeVehicleId) || FLEET_VEHICLES[0];

    // Highlight map node
    this.container.querySelectorAll('.control-map-node').forEach(node => {
      if (node.getAttribute('data-id') === this.activeVehicleId) {
        node.classList.add('is-active');
      } else {
        node.classList.remove('is-active');
      }
    });

    // Highlight roster row
    this.container.querySelectorAll('.fleet-roster-row').forEach(row => {
      if (row.getAttribute('data-id') === this.activeVehicleId) {
        row.classList.add('is-selected');
      } else {
        row.classList.remove('is-selected');
      }
    });

    // Update Telemetry Detail Card
    const inspector = this.container.querySelector('#control-veh-inspector');
    if (inspector) {
      inspector.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <div class="survey-label" style="font-size: 0.65rem;">UNIT INSPECTOR</div>
            <div style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase;">${veh.id} // ${veh.type}</div>
          </div>
          <span class="telemetry-tag ${veh.status}">
            <span class="pulse-dot"></span>${veh.riskLevel}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.75rem; margin-bottom: 0.75rem;">
          <div style="background: var(--bg-inset); padding: 0.6rem; border: 1px solid var(--line-structure); border-radius: var(--radius-xs);">
            <div style="color: var(--text-muted); font-size: 0.65rem; margin-bottom: 2px;">OPERATOR</div>
            <div style="color: var(--text-primary); font-weight: 600;">${veh.operator}</div>
          </div>
          <div style="background: var(--bg-inset); padding: 0.6rem; border: 1px solid var(--line-structure); border-radius: var(--radius-xs);">
            <div style="color: var(--text-muted); font-size: 0.65rem; margin-bottom: 2px;">CURRENT ZONE</div>
            <div style="color: var(--accent-amber); font-weight: 600;">${veh.zone}</div>
          </div>
          <div style="background: var(--bg-inset); padding: 0.6rem; border: 1px solid var(--line-structure); border-radius: var(--radius-xs);">
            <div style="color: var(--text-muted); font-size: 0.65rem; margin-bottom: 2px;">BENCH ELEVATION</div>
            <div style="color: var(--text-primary); font-weight: 600;">${veh.elevation}</div>
          </div>
          <div style="background: var(--bg-inset); padding: 0.6rem; border: 1px solid var(--line-structure); border-radius: var(--radius-xs);">
            <div style="color: var(--text-muted); font-size: 0.65rem; margin-bottom: 2px;">GROUND SPEED</div>
            <div style="color: var(--text-primary); font-weight: 600;">${veh.speed} km/h (${veh.bearingText})</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.6rem; border-top: 1px solid var(--line-structure); font-family: var(--font-mono); font-size: 0.72rem;">
          <span style="color: var(--text-secondary);">FOSAFE BEACON: <strong style="color: var(--accent-amber);">${veh.telemetry.fogAssist}</strong></span>
          <span style="color: var(--text-muted);">LAST TELEMETRY: ${veh.lastUpdate}</span>
        </div>
      `;
    }
  }

  updateRosterList() {
    const listBody = this.container.querySelector('#fleet-roster-body');
    if (!listBody) return;

    const filtered = FLEET_VEHICLES.filter(v => {
      if (this.filter === 'warning') return v.status === 'warning';
      if (this.filter === 'critical') return v.status === 'critical';
      return true;
    });

    listBody.innerHTML = filtered.map(v => `
      <tr class="fleet-roster-row ${v.id === this.activeVehicleId ? 'is-selected' : ''}" data-id="${v.id}">
        <td style="font-weight: 700; color: var(--text-primary);">${v.id}</td>
        <td style="color: var(--text-secondary);">${v.type.split(' ')[0]}</td>
        <td>
          <span class="telemetry-tag ${v.status}" style="font-size: 0.65rem; padding: 2px 6px;">
            ${v.riskLevel}
          </span>
        </td>
        <td class="font-mono" style="color: ${v.distanceToHazard < 10 ? 'var(--state-critical)' : 'var(--text-primary)'}; font-weight: 700;">
          ${v.distanceToHazard < 10 ? `0${v.distanceToHazard.toFixed(1)}` : v.distanceToHazard.toFixed(1)}m
        </td>
      </tr>
    `).join('');

    // Rebind row clicks
    this.container.querySelectorAll('.fleet-roster-row').forEach(row => {
      row.addEventListener('click', () => {
        this.selectVehicle(row.getAttribute('data-id'));
      });
    });
  }

  bindEvents() {
    // Map blip clicks
    this.container.querySelectorAll('.control-map-node').forEach(node => {
      node.addEventListener('click', () => {
        this.selectVehicle(node.getAttribute('data-id'));
      });
    });

    // Roster row clicks
    this.updateRosterList();

    // Filter clicks
    this.container.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.setFilter(btn.getAttribute('data-filter'));
      });
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="control-room-layout" style="background: var(--bg-panel); border: 1px solid var(--line-structure); border-radius: var(--radius-xs); padding: var(--sp-6);">
        <!-- Left: Haul-Road Topographical Map -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="provenance-tag live">DISPATCH RADAR</span>
              <span class="font-mono" style="font-size: 0.72rem; color: var(--text-muted);">SECTOR 04 CENTRAL PIT</span>
            </div>
            <span class="font-mono" style="font-size: 0.72rem; color: var(--steel-300);">UPLINK: 868MHz + LTE</span>
          </div>

          <div class="fleet-map-canvas-container" style="background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-xs);">
            <svg viewBox="0 0 600 420" width="100%" height="100%" style="display: block;">
              <!-- Pit Topography Grids & Contours -->
              <rect width="600" height="420" fill="var(--bg-inset)" />
              
              <!-- Contour Lines -->
              <path d="M 0 60 Q 200 40 400 70 T 600 50" stroke="var(--line-structure)" stroke-width="1.5" fill="none" />
              <path d="M 0 140 Q 250 120 420 160 T 600 130" stroke="var(--line-structure)" stroke-width="1.5" fill="none" />
              <path d="M 0 240 Q 180 220 380 260 T 600 230" stroke="var(--line-structure)" stroke-width="1.5" fill="none" />
              <path d="M 0 340 Q 220 320 440 360 T 600 330" stroke="var(--line-structure)" stroke-width="1.5" fill="none" />

              <!-- Main Haul Road Network (Ribbon) -->
              <!-- Upper Ramp -->
              <path d="M 520 20 L 460 120 L 320 180 L 160 220 L 80 340 L 140 400" 
                    stroke="var(--bg-surface)" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <path d="M 520 20 L 460 120 L 320 180 L 160 220 L 80 340 L 140 400" 
                    stroke="var(--accent-amber)" stroke-width="1.5" stroke-dasharray="8 8" fill="none" opacity="0.4" />

              <!-- Secondary Spur to Crusher -->
              <path d="M 320 180 L 480 240 L 560 300" stroke="var(--bg-surface)" stroke-width="26" fill="none" />

              <!-- Dangerous Blind Curve Geofence (Ramp 04 Junction) -->
              <rect x="260" y="140" width="140" height="90" rx="4" fill="rgba(239, 68, 68, 0.08)" stroke="rgba(239, 68, 68, 0.45)" stroke-dasharray="4 4" />
              <text x="270" y="156" font-family="'JetBrains Mono', monospace" font-size="8" fill="var(--state-critical)" font-weight="700">HAZARD ZONE: BLIND HAIRPIN</text>

              <!-- VEHICLE NODE: D-07 (Warning State) -->
              <g class="control-map-node is-active" data-id="D-07" transform="translate(310, 182)" style="cursor: pointer;">
                <circle cx="0" cy="0" r="26" fill="rgba(245, 158, 11, 0.15)" stroke="var(--accent-amber)" stroke-width="1" stroke-dasharray="3 3" />
                <rect x="-8" y="-6" width="16" height="12" fill="var(--bg-surface)" stroke="var(--accent-amber)" stroke-width="1.5" />
                <circle cx="0" cy="0" r="2" fill="var(--accent-amber)" />
                <text x="14" y="-8" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="var(--text-primary)">D-07 [8.4m]</text>
                <text x="14" y="4" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="var(--accent-amber)">MED RISK</text>
              </g>

              <!-- VEHICLE NODE: S-01 (Critical Proximity) -->
              <g class="control-map-node" data-id="S-01" transform="translate(345, 172)" style="cursor: pointer;">
                <circle cx="0" cy="0" r="20" fill="rgba(239, 68, 68, 0.2)" stroke="var(--state-critical)" stroke-width="1.5" />
                <rect x="-6" y="-5" width="12" height="10" fill="var(--bg-surface)" stroke="var(--state-critical)" stroke-width="1.5" />
                <circle cx="0" cy="0" r="2" fill="var(--state-critical)" />
                <text x="12" y="-6" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="var(--state-critical)">S-01 [CRIT]</text>
              </g>

              <!-- Proximity line between D-07 and S-01 -->
              <line x1="310" y1="182" x2="345" y2="172" stroke="var(--state-critical)" stroke-width="1.5" stroke-dasharray="2 3" />

              <!-- VEHICLE NODE: D-12 (Normal Crusher Loop) -->
              <g class="control-map-node" data-id="D-12" transform="translate(490, 248)" style="cursor: pointer;">
                <circle cx="0" cy="0" r="22" fill="rgba(16, 185, 129, 0.12)" stroke="var(--state-normal)" stroke-width="1" />
                <rect x="-8" y="-6" width="16" height="12" fill="var(--bg-surface)" stroke="var(--state-normal)" stroke-width="1.5" />
                <text x="14" y="-4" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="var(--text-primary)">D-12 (42m)</text>
              </g>

              <!-- VEHICLE NODE: L-04 (Stationary Pit Floor Shovel) -->
              <g class="control-map-node" data-id="L-04" transform="translate(130, 390)" style="cursor: pointer;">
                <circle cx="0" cy="0" r="16" fill="rgba(98, 112, 132, 0.2)" stroke="var(--steel-500)" stroke-width="1" />
                <polygon points="0,-7 6,4 -6,4" fill="var(--steel-500)" />
                <text x="12" y="2" font-family="'JetBrains Mono', monospace" font-size="8" fill="var(--text-muted)">L-04 (LOADING)</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Right: Tactical Dispatch Controls & Telemetry Inspector -->
        <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
          <!-- Filter Tabs -->
          <div style="display: flex; gap: 0.35rem;">
            <button class="capsule-nav-link sensor-selector-pill is-active" data-filter="all" style="flex: 1; justify-content: center; text-align: center; padding: 0.4rem 0.6rem; font-size: 0.72rem; cursor: pointer;">ALL (4)</button>
            <button class="capsule-nav-link sensor-selector-pill" data-filter="warning" style="flex: 1; justify-content: center; text-align: center; padding: 0.4rem 0.6rem; font-size: 0.72rem; color: var(--state-warning); cursor: pointer;">WARN (1)</button>
            <button class="capsule-nav-link sensor-selector-pill" data-filter="critical" style="flex: 1; justify-content: center; text-align: center; padding: 0.4rem 0.6rem; font-size: 0.72rem; color: var(--state-critical); cursor: pointer;">CRIT (1)</button>
          </div>

          <!-- Roster Table -->
          <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-xs); overflow: hidden;">
            <table class="fleet-roster-table">
              <thead>
                <tr>
                  <th>UNIT</th>
                  <th>MODEL</th>
                  <th>RISK</th>
                  <th>HAZARD DIST</th>
                </tr>
              </thead>
              <tbody id="fleet-roster-body">
                <!-- Injected via updateRosterList() -->
              </tbody>
            </table>
          </div>

          <!-- Unit Telemetry Detail Card -->
          <div id="control-veh-inspector" style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1rem; border-radius: var(--radius-xs);">
            <!-- Dynamic via updateSelection() -->
          </div>
        </div>
      </div>
    `;

    this.updateRosterList();
    this.updateSelection();
  }
}
