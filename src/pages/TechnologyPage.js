/**
 * FOSAFE v2 TechnologyPage
 * Deep dive into embedded hardware, dual-core task architecture,
 * sensor bus topologies, and mining-grade electrical conditioning.
 * Fully supports Dark Mode and Light Mode with responsive survey styling.
 */

export class TechnologyPage {
  constructor(container) {
    this.container = container;
  }

  mount() {
    this.render();
  }

  unmount() {}

  render() {
    this.container.innerHTML = `
      <div style="padding: calc(64px + var(--sp-8)) var(--sp-6) var(--sp-20);">
        <div style="max-width: 1320px; margin: 0 auto;">
          <!-- Page Header -->
          <div style="margin-bottom: var(--sp-12); max-width: 860px;">
            <div class="station-marker font-mono">
              <span>HARDWARE &amp; FIRMWARE ARCHITECTURE // STATION SPEC</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4.2rem); font-weight: 800; color: var(--text-primary); text-transform: uppercase;">
              VEHICLE UNIT TECHNOLOGY
            </h1>
            <p class="lead-text" style="margin-top: 0.75rem;">
              Engineering specifications for the FOSAFE in-cab edge computing unit. Designed to execute local collision avoidance logic deterministically, independent of cloud connectivity or mine radio network latency.
            </p>
          </div>

          <!-- Dual-Core Processing Architecture Panel -->
          <div class="station-panel" style="margin-bottom: var(--sp-8);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">PROCESSING CORE</span>
                <h3 style="font-size: 1.6rem; color: var(--text-primary); margin-top: 0.2rem;">ESP32-S3 DUAL-CORE XTENSA 32-BIT LX7</h3>
              </div>
              <span class="provenance-tag live">240 MHZ HARDWARE CLOCK</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-6);">
              <!-- Core 0 -->
              <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1.5rem; border-radius: var(--radius-xs);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <strong style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--accent-amber);">CORE 0: TELEMATICS &amp; COMMS</strong>
                  <span class="survey-label" style="font-size: 0.65rem;">FREE-RTOS TASK</span>
                </div>
                <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem;">
                  Dedicated exclusively to network stack management, radio communications, and cloud telemetry ingestion. Prevents network latency or packet retries from blocking critical vehicle safety interrupts.
                </p>
                <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-secondary); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                  <span>• MQTT 3.1.1 protocol client with TLS</span>
                  <span>• ESP-NOW peer-to-peer mesh broadcast</span>
                  <span>• GNSS NMEA sentence parsing (10Hz)</span>
                  <span>• WiFi / LTE-M fallback gateway</span>
                </div>
              </div>

              <!-- Core 1 -->
              <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1.5rem; border-radius: var(--radius-xs);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <strong style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--state-normal);">CORE 1: REAL-TIME SAFETY ENGINE</strong>
                  <span class="provenance-tag live" style="font-size: 0.65rem;">HIGH-PRIORITY ISR</span>
                </div>
                <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem;">
                  Executes the deterministic collision avoidance loop. Samples proximity sensors, executes IMU DMP quaternion filtering, and commands in-cab audio/visual drivers in under 15 milliseconds.
                </p>
                <div class="small-mono" style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-secondary); border-top: 1px solid var(--line-subtle); padding-top: 0.75rem;">
                  <span>• Ultrasonic 40kHz acoustic pulse-width timing ISR</span>
                  <span>• I2C Fast-Mode MPU6050 6-axis polling (100Hz)</span>
                  <span>• Hardware timer-driven PWM buzzer audio</span>
                  <span>• Physical Fog Assist GPIO interrupt debounce</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sensor Bus Electrical Topology Table -->
          <div class="station-panel" style="margin-bottom: var(--sp-8);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">BUS TIMING &amp; PROTOCOLS</span>
                <h3 style="font-size: 1.6rem; color: var(--text-primary); margin-top: 0.2rem;">DETERMINISTIC SENSOR INTERFACE BUS</h3>
              </div>
              <span class="provenance-tag live">HARDWARE INTERRUPT CONTROLLED</span>
            </div>

            <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
              <table style="width: 100%; border-collapse: collapse; min-width: 680px; font-size: 0.85rem;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--line-strong); text-align: left;">
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">SUBSYSTEM</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">BUS PROTOCOL</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">SAMPLE RATE</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">INTERRUPT LEVEL</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">FAIL-SAFE BEHAVIOR</th>
                  </tr>
                </thead>
                <tbody class="font-mono">
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.85rem 0.5rem;"><strong style="color: var(--text-primary);">HC-SR04 / JSN-SR04T</strong></td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary);">GPIO Pulse Width Timing</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--accent-amber);">25 Hz</td>
                    <td style="padding: 0.85rem 0.5rem;">Level 3 (Hardware Timer)</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-muted);">Last valid range hold + radar warning</td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.85rem 0.5rem;"><strong style="color: var(--text-primary);">MPU6050 6-Axis IMU</strong></td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary);">I2C Fast Mode (400 kHz)</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--accent-amber);">100 Hz</td>
                    <td style="padding: 0.85rem 0.5rem;">Level 2 (I2C DMA)</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-muted);">Default flat-grade assumption (0% slope)</td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.85rem 0.5rem;"><strong style="color: var(--text-primary);">u-blox NEO-6M GNSS</strong></td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary);">UART Serial (115200 Baud)</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--accent-amber);">10 Hz</td>
                    <td style="padding: 0.85rem 0.5rem;">Level 1 (Ring Buffer)</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-muted);">Dead reckoning via IMU integration</td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.85rem 0.5rem;"><strong style="color: var(--text-primary);">Optical IR Berm Array</strong></td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary);">GPIO Digital Comparator</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--accent-amber);">400 Hz</td>
                    <td style="padding: 0.85rem 0.5rem;">Level 3 (Edge Change ISR)</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-muted);">Warning indicator on open circuit</td>
                  </tr>
                  <tr>
                    <td style="padding: 0.85rem 0.5rem;"><strong style="color: var(--text-primary);">DHT11 Environmental</strong></td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-secondary);">Single-Bus 1-Wire Digital</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--accent-amber);">1 Hz</td>
                    <td style="padding: 0.85rem 0.5rem;">Level 1 (Periodic Task)</td>
                    <td style="padding: 0.85rem 0.5rem; color: var(--text-muted);">Retains last ambient baseline</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Electrical Conditioning & Ruggedization Blueprint Trio -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--sp-6);">
            <div class="station-panel">
              <span class="survey-label survey-label-amber">POWER CONDITIONING</span>
              <h4 style="margin: 0.4rem 0 0.5rem; color: var(--text-primary);">24V Transient Suppression</h4>
              <p style="font-size: 0.85rem; line-height: 1.6;">
                Heavy earthmovers experience massive voltage surges during diesel cranking and dynamic retarder braking. FOSAFE incorporates automotive TVS diodes, reverse polarity isolation, and dual-stage buck converters (24V → 5V → 3.3V).
              </p>
            </div>

            <div class="station-panel">
              <span class="survey-label survey-label-amber">ENVIRONMENTAL HOUSING</span>
              <h4 style="margin: 0.4rem 0 0.5rem; color: var(--text-primary);">IP67 Extruded Enclosure</h4>
              <p style="font-size: 0.85rem; line-height: 1.6;">
                Housed in an anodized extruded aluminum chassis with silicone gasket seals and pressure-equalizing Gore vents. Resists airborne silica dust, coal particulates, slurry spray, and temperatures from -10°C to +65°C.
              </p>
            </div>

            <div class="station-panel">
              <span class="survey-label survey-label-amber">FAIL-SAFE INTEGRITY</span>
              <h4 style="margin: 0.4rem 0 0.5rem; color: var(--text-primary);">Hardware Watchdog Supervisor</h4>
              <p style="font-size: 0.85rem; line-height: 1.6;">
                An independent hardware supervisory IC monitors ESP32 heartbeats. If firmware stalls or memory corrupts, the system triggers a sub-50ms cold reboot and switches the in-cab warning lamp to fail-safe manual override.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
