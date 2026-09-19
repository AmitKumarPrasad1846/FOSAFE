/**
 * FOSAFE TechnologyPage
 * Deep dive into embedded hardware, dual-core task architecture,
 * sensor bus topologies, and mining-grade electrical conditioning.
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
      <div style="padding: var(--space-12) 0 var(--space-20);">
        <div class="container">
          <!-- Page Header -->
          <div style="margin-bottom: var(--space-12);">
            <div class="section-eyebrow">
              <span class="pulse-dot"></span>
              <span>HARDWARE &amp; FIRMWARE ARCHITECTURE</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #EDEFEF; text-transform: uppercase;">
              VEHICLE UNIT TECHNOLOGY
            </h1>
            <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 780px; margin-top: 0.75rem; line-height: 1.6;">
              Engineering specifications for the FOSAFE in-cab edge computing unit. Designed to execute local collision avoidance logic deterministically, independent of cloud connectivity or mine radio network latency.
            </p>
          </div>

          <!-- Dual-Core Processing Architecture Panel -->
          <div class="tech-panel" style="margin-bottom: var(--space-8);">
            <div class="tech-header">
              <span class="tech-title">PROCESSING CORE // ESP32 DUAL-CORE XTENSA 32-BIT LX6</span>
              <span class="telemetry-tag normal"><span class="pulse-dot"></span>240 MHZ CLOCK</span>
            </div>

            <div class="industrial-grid industrial-grid-2" style="margin-top: 1rem;">
              <div style="background: #090B0F; border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: var(--radius-xs);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <strong style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent-amber);">CORE 0: TELEMATICS &amp; COMMS</strong>
                  <span class="telemetry-tag" style="font-size: 0.65rem;">FREE-RTOS TASK</span>
                </div>
                <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 0.75rem;">
                  Dedicated exclusively to network stack management, radio communications, and cloud telemetry ingestion. Prevents network latency or packet retries from blocking critical vehicle safety interrupts.
                </p>
                <div class="footer-links" style="font-size: 0.75rem;">
                  <span class="mono-readout" style="color: var(--steel-300);">• MQTT 3.1.1 protocol client with TLS</span>
                  <span class="mono-readout" style="color: var(--steel-300);">• ESP-NOW peer-to-peer mesh broadcast</span>
                  <span class="mono-readout" style="color: var(--steel-300);">• GNSS NMEA sentence parsing (10Hz)</span>
                  <span class="mono-readout" style="color: var(--steel-300);">• WiFi / LTE fallback handler</span>
                </div>
              </div>

              <div style="background: #090B0F; border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: var(--radius-xs);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <strong style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--status-normal);">CORE 1: REAL-TIME SAFETY ENGINE</strong>
                  <span class="telemetry-tag normal" style="font-size: 0.65rem;">HIGH-PRIORITY ISR</span>
                </div>
                <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 0.75rem;">
                  Executes the deterministic collision avoidance loop. Samples proximity sensors, executes IMU DMP quaternion filtering, and commands in-cab audio/visual drivers in under 15 milliseconds.
                </p>
                <div class="footer-links" style="font-size: 0.75rem;">
                  <span class="mono-readout" style="color: var(--steel-300);">• Ultrasonic 40kHz pulse-width timing ISR</span>
                  <span class="mono-readout" style="color: var(--steel-300);">• I2C Fast-Mode MPU6050 6-axis polling (100Hz)</span>
                  <span class="mono-readout" style="color: var(--steel-300);">• Hardware timer-driven PWM buzzer audio</span>
                  <span class="mono-readout" style="color: var(--steel-300);">• Physical Fog Assist GPIO interrupt debounce</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sensor Bus Electrical Topology -->
          <div class="tech-panel" style="margin-bottom: var(--space-8);">
            <div class="tech-header">
              <span class="tech-title">SENSOR BUS PROTOCOLS &amp; TIMING</span>
              <span class="telemetry-tag warning">DETERMINISTIC BUS</span>
            </div>

            <table class="sensor-spec-table" style="margin-top: 0.5rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-medium);">
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">SUBSYSTEM</th>
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">BUS PROTOCOL</th>
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">SAMPLE RATE</th>
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">INTERRUPT PRIORITY</th>
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">FAIL-SAFE FALLBACK</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>HC-SR04 Ultrasonic</strong></td>
                  <td>GPIO Trigger / Echo Pulse Width</td>
                  <td>25 Hz</td>
                  <td>Level 3 (Hardware Timer)</td>
                  <td>Last valid range hold + radar warning</td>
                </tr>
                <tr>
                  <td><strong>MPU6050 6-DOF IMU</strong></td>
                  <td>I2C Fast Mode (400 kHz)</td>
                  <td>100 Hz</td>
                  <td>Level 2 (I2C DMA)</td>
                  <td>Default flat-grade assumption (0% slope)</td>
                </tr>
                <tr>
                  <td><strong>u-blox NEO-6M GNSS</strong></td>
                  <td>UART Serial (115200 Baud)</td>
                  <td>10 Hz</td>
                  <td>Level 1 (Ring Buffer)</td>
                  <td>Dead reckoning via IMU step integration</td>
                </tr>
                <tr>
                  <td><strong>Optical IR Berm Array</strong></td>
                  <td>GPIO Digital Comparator</td>
                  <td>400 Hz</td>
                  <td>Level 3 (Edge Change ISR)</td>
                  <td>Warning indicator on open circuit</td>
                </tr>
                <tr>
                  <td><strong>DHT11 Environmental</strong></td>
                  <td>Single-Bus 1-Wire Digital</td>
                  <td>1 Hz</td>
                  <td>Level 1 (Periodic Task)</td>
                  <td>Retains last ambient humidity baseline</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Electrical Conditioning & Ruggedization -->
          <div class="industrial-grid industrial-grid-3">
            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">POWER CONDITIONING</span>
              </div>
              <h4 style="font-family: var(--font-display); color: #EDEFEF; margin-bottom: 0.5rem;">24V Mine-Vehicle Transient Protection</h4>
              <p style="font-size: 0.82rem; line-height: 1.55; color: var(--text-secondary);">
                Heavy earthmovers experience massive voltage surges during diesel cranking and dynamic retarder braking. FOSAFE incorporates automotive TVS diodes (transient voltage suppressors), reverse polarity isolation, and dual-stage buck converters (24V → 5V → 3.3V).
              </p>
            </div>

            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">ENVIRONMENTAL SEALING</span>
              </div>
              <h4 style="font-family: var(--font-display); color: #EDEFEF; margin-bottom: 0.5rem;">IP67 Extruded Enclosure</h4>
              <p style="font-size: 0.82rem; line-height: 1.55; color: var(--text-secondary);">
                Housed in an anodized extruded aluminum chassis with silicone gasket seals and pressure-equalizing Gore vents. Resists airborne silica dust, coal particulates, slurry spray, and temperatures from -10°C to +65°C.
              </p>
            </div>

            <div class="tech-panel">
              <div class="tech-header">
                <span class="tech-title">FAIL-SAFE INTEGRITY</span>
              </div>
              <h4 style="font-family: var(--font-display); color: #EDEFEF; margin-bottom: 0.5rem;">Hardware Watchdog Timer</h4>
              <p style="font-size: 0.82rem; line-height: 1.55; color: var(--text-secondary);">
                An independent hardware supervisory IC monitors the ESP32 heartbeats. In the unlikely event of firmware hang or memory corruption, the system triggers a sub-50ms cold reboot and switches the cab warning lamp to manual override.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
