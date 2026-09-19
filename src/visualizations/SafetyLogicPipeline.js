/**
 * FOSAFE Real-Time Safety Logic Pipeline
 * Animated deterministic arbitration chain:
 * SENSORS -> DISTANCE -> MOTION -> VISIBILITY -> RISK ARBITRATION -> DRIVER ALERT -> DISPATCH UPLINK
 */

export class SafetyLogicPipeline {
  constructor(containerElement) {
    this.container = containerElement;
    this.activeStep = 0;
    this.isPlaying = false;
    this.timer = null;

    this.steps = [
      {
        id: 1,
        short: 'VEHICLE SENSORS',
        title: 'Multi-Sensor Ingestion',
        latency: '0.0 ms',
        detail: 'Simultaneous acquisition from HC-SR04 ultrasonic, IR edge array, and GNSS RTK receiver via hardware interrupt.',
        spec: 'Sample rate: 100Hz'
      },
      {
        id: 2,
        short: 'DISTANCE',
        title: 'Acoustic & Optical Ranging',
        latency: '+3.2 ms',
        detail: 'Hardware pulse-width timing computes distance to physical objects without atmospheric distortion from fog or dust.',
        spec: 'Obstacle: 08.40 meters'
      },
      {
        id: 3,
        short: 'MOTION',
        title: 'IMU Inertial Vector Analysis',
        latency: '+6.8 ms',
        detail: 'MPU6050 evaluates vehicle grade (+7.4% slope), roll stability, and closing velocity (+4.2 km/h delta).',
        spec: 'Stopping buffer dynamic scalar: 1.4x'
      },
      {
        id: 4,
        short: 'VISIBILITY',
        title: 'Contextual Atmosphere Fusion',
        latency: '+11.5 ms',
        detail: 'Merges operator visibility mode with DHT11 ambient humidity/temperature to select active safety perimeter tier.',
        spec: 'Mode: LOW VISIBILITY (80m zone)'
      },
      {
        id: 5,
        short: 'RISK ARBITRATION',
        title: 'Deterministic Edge Risk Engine',
        latency: '+14.2 ms',
        detail: 'Calculates time-to-impact (TTI < 2.1s). Distance violates safe stopping distance at 400-ton gross vehicle weight.',
        spec: 'Rating: MEDIUM RISK // WARNING'
      },
      {
        id: 6,
        short: 'DRIVER ALERT',
        title: 'In-Cab Multi-Modal Warning',
        latency: '+15.1 ms',
        detail: 'Triggers cab HUD display amber flashing banner and acoustic alert buzzer. ESP32 toggles external strobe beacon.',
        spec: 'Local Cab Latency: <16 ms'
      },
      {
        id: 7,
        short: 'CONTROL ROOM',
        title: 'Fleet Cloud / MQTT Broadcast',
        latency: '+42.0 ms',
        detail: 'Encodes lightweight JSON/Protobuf telemetry frame; broadcasts to dispatch servers via 868MHz / LTE.',
        spec: 'QoS 1 Delivered to Dispatch'
      }
    ];

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  startPulse() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.activeStep = 0;
    this.updateView();

    const nextStep = () => {
      if (this.activeStep < this.steps.length - 1) {
        this.activeStep++;
        this.updateView();
        this.timer = setTimeout(nextStep, 500);
      } else {
        this.isPlaying = false;
        // Keep final step active for 1.5s then allow replay
      }
    };

    this.timer = setTimeout(nextStep, 500);
  }

  selectStep(idx) {
    if (this.isPlaying) return;
    this.activeStep = idx;
    this.updateView();
  }

  updateView() {
    const current = this.steps[this.activeStep];

    // Update node states
    this.container.querySelectorAll('.pipeline-node').forEach((node, idx) => {
      if (idx === this.activeStep) {
        node.classList.add('active-stage');
      } else {
        node.classList.remove('active-stage');
      }
    });

    // Update inspector
    const detailBox = this.container.querySelector('#pipeline-step-detail');
    if (detailBox) {
      detailBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <span class="telemetry-tag warning" style="font-size: 0.68rem; margin-bottom: 0.25rem;">
              STAGE 0${current.id} OF 07 // ${current.short}
            </span>
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: #EDEFEF;">${current.title}</h4>
          </div>
          <span class="mono-readout" style="font-size: 0.82rem; color: var(--accent-amber); font-weight: 700;">
            TOTAL DELAY: ${current.latency}
          </span>
        </div>
        <p style="font-size: 0.85rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 0.6rem;">
          ${current.detail}
        </p>
        <div style="background: #080A0E; padding: 0.5rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); font-family: var(--font-mono); font-size: 0.75rem; color: var(--steel-300);">
          COMPUTATION ARTIFACT: <strong style="color: #EDEFEF;">${current.spec}</strong>
        </div>
      `;
    }
  }

  bindEvents() {
    const runBtn = this.container.querySelector('#run-pipeline-btn');
    if (runBtn) {
      runBtn.addEventListener('click', () => this.startPulse());
    }

    this.container.querySelectorAll('.pipeline-node').forEach((node, idx) => {
      node.addEventListener('click', () => this.selectStep(idx));
    });
  }

  render() {
    this.container.innerHTML = `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: var(--space-6);">
        <!-- Top bar with trigger button & latency total -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
          <div>
            <span class="section-eyebrow">DETERMINISTIC EMBEDDED PIPELINE</span>
            <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: #EDEFEF;">
              SENSOR-TO-ALERT ARBITRATION CHAIN
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="mono-readout" style="font-size: 0.75rem; color: var(--text-muted);">
              DETERMINISTIC LATENCY: <strong style="color: var(--status-normal);">&lt; 45ms</strong>
            </div>
            <button id="run-pipeline-btn" class="btn btn-primary btn-sm">
              ▶ SIMULATE DATA CYCLE
            </button>
          </div>
        </div>

        <!-- Horizontal Pipeline Flow Strip -->
        <div class="pipeline-flow-strip" style="margin-bottom: 1.5rem;">
          ${this.steps.map((s, idx) => `
            <div class="pipeline-node ${idx === 0 ? 'active-stage' : ''}" style="cursor: pointer;">
              <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-amber); margin-bottom: 2px;">
                0${s.id}
              </div>
              <div style="font-family: var(--font-display); font-size: 0.82rem; font-weight: 700; color: #EDEFEF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${s.short}
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); margin-top: 2px;">
                ${s.latency}
              </div>
            </div>
            ${idx < this.steps.length - 1 ? '<span class="pipeline-connector">→</span>' : ''}
          `).join('')}
        </div>

        <!-- Detail Inspector for active step -->
        <div id="pipeline-step-detail" style="background: #0D1016; border: 1px solid var(--border-medium); border-radius: var(--radius-xs); padding: 1rem;">
          <!-- Dynamically populated via updateView() -->
        </div>
      </div>
    `;

    this.updateView();
  }

  destroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
