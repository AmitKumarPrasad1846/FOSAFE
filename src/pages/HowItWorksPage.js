/**
 * FOSAFE HowItWorksPage
 * Mathematical safety envelope calculations, stopping dynamics on mine ramps,
 * and interactive physics calculation test bench.
 */

export class HowItWorksPage {
  constructor(container) {
    this.container = container;
    this.speedKmh = 25;
    this.gradePercent = -8; // -8% downhill
    this.reactionTime = 1.5; // seconds
    this.friction = 0.28; // wet aggregate haul road
  }

  mount() {
    this.render();
    this.bindEvents();
    this.calculateBraking();
  }

  unmount() {}

  calculateBraking() {
    // v in m/s
    const v = (this.speedKmh * 1000) / 3600;
    const g = 9.81;
    // grade angle theta
    const theta = Math.atan(this.gradePercent / 100);
    
    // Braking distance = v^2 / (2 * g * (mu + sin(theta)))
    // When downhill, sin(theta) is negative, denominator is smaller, stopping distance increases drastically!
    const effectiveDecel = g * (this.friction + Math.sin(theta));
    const safeDecel = Math.max(effectiveDecel, 0.4); // prevent division by zero
    const brakingDist = (v * v) / (2 * safeDecel);
    const reactionDist = v * this.reactionTime;
    const totalStoppingDist = brakingDist + reactionDist;

    // Update DOM
    const totalElem = this.container.querySelector('#calc-total-stopping');
    const brakeElem = this.container.querySelector('#calc-braking-dist');
    const reactElem = this.container.querySelector('#calc-reaction-dist');
    const speedValElem = this.container.querySelector('#calc-speed-val');
    const gradeValElem = this.container.querySelector('#calc-grade-val');
    const statusTag = this.container.querySelector('#calc-hazard-status');

    if (totalElem) totalElem.textContent = `${totalStoppingDist.toFixed(1)} m`;
    if (brakeElem) brakeElem.textContent = `${brakingDist.toFixed(1)} m`;
    if (reactElem) reactElem.textContent = `${reactionDist.toFixed(1)} m`;
    if (speedValElem) speedValElem.textContent = `${this.speedKmh} km/h`;
    if (gradeValElem) gradeValElem.textContent = `${this.gradePercent > 0 ? '+' : ''}${this.gradePercent}% Grade`;

    if (statusTag) {
      if (totalStoppingDist > 50) {
        statusTag.className = 'telemetry-tag critical';
        statusTag.innerHTML = '<span class="pulse-dot"></span>CRITICAL STOPPING DEFICIT IN FOG';
      } else if (totalStoppingDist > 30) {
        statusTag.className = 'telemetry-tag warning';
        statusTag.innerHTML = '<span class="pulse-dot"></span>ELEVATED HAZARD BUFFER';
      } else {
        statusTag.className = 'telemetry-tag normal';
        statusTag.innerHTML = '<span class="pulse-dot"></span>CONTROLLED STOPPING ENVELOPE';
      }
    }
  }

  bindEvents() {
    const speedSlider = this.container.querySelector('#speed-slider');
    const gradeSlider = this.container.querySelector('#grade-slider');

    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        this.speedKmh = parseInt(e.target.value, 10);
        this.calculateBraking();
      });
    }

    if (gradeSlider) {
      gradeSlider.addEventListener('input', (e) => {
        this.gradePercent = parseInt(e.target.value, 10);
        this.calculateBraking();
      });
    }
  }

  render() {
    this.container.innerHTML = `
      <div style="padding: var(--space-12) 0 var(--space-20);">
        <div class="container">
          <!-- Page Title -->
          <div style="margin-bottom: var(--space-12);">
            <div class="section-eyebrow">
              <span class="pulse-dot"></span>
              <span>HAULAGE KINEMATICS &amp; ARBITRATION</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #EDEFEF; text-transform: uppercase;">
              HOW FOSAFE ARBITRATES RISK
            </h1>
            <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 780px; margin-top: 0.75rem; line-height: 1.6;">
              Understanding the physical dynamics of heavy haulage stopping distances on steep mine ramp gradients, and how FOSAFE fuses multi-sensor telemetry to trigger deterministic warnings.
            </p>
          </div>

          <!-- Interactive Physics Calculation Testbench -->
          <div class="tech-panel" style="margin-bottom: var(--space-12);">
            <div class="tech-header">
              <span class="tech-title">STOPPING DISTANCE PHYSICS SIMULATOR</span>
              <span id="calc-hazard-status" class="telemetry-tag warning"><span class="pulse-dot"></span>ELEVATED HAZARD BUFFER</span>
            </div>

            <div class="industrial-grid industrial-grid-2" style="margin-top: 1rem; align-items: center;">
              <!-- Left: Sliders -->
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="data-label">HAUL TRUCK SPEED</span>
                    <span id="calc-speed-val" class="mono-readout" style="font-size: 1rem; font-weight: 700; color: var(--accent-amber);">25 km/h</span>
                  </div>
                  <input type="range" id="speed-slider" min="10" max="40" value="25" step="1" style="width: 100%; accent-color: var(--accent-amber);" />
                  <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">
                    <span>10 km/h (Crawl)</span>
                    <span>25 km/h (Standard)</span>
                    <span>40 km/h (Max)</span>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="data-label">HAUL RAMP GRADIENT</span>
                    <span id="calc-grade-val" class="mono-readout" style="font-size: 1rem; font-weight: 700; color: var(--accent-amber);">-8% Grade</span>
                  </div>
                  <input type="range" id="grade-slider" min="-12" max="6" value="-8" step="1" style="width: 100%; accent-color: var(--accent-amber);" />
                  <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">
                    <span>-12% (Steep Descent)</span>
                    <span>-8% (Typical Ramp)</span>
                    <span>+6% (Ascent)</span>
                  </div>
                </div>

                <div style="background: #090B0F; border: 1px solid var(--border-subtle); padding: 0.85rem; border-radius: var(--radius-xs);">
                  <div class="data-label" style="margin-bottom: 0.25rem;">PHYSICAL PARAMETERS FIXED</div>
                  <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">
                    • Gross Vehicle Weight (GVW): <strong>400 Metric Tons</strong><br/>
                    • Road Surface Friction (&mu;): <strong>0.28</strong> (Wet crushed haul aggregate)<br/>
                    • Human Operator Perception/Reaction: <strong>1.5 seconds</strong>
                  </div>
                </div>
              </div>

              <!-- Right: Calculated Results Card -->
              <div style="background: #0D1016; border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 1.5rem;">
                <span class="data-label" style="color: var(--accent-amber);">TOTAL REQUIRED STOPPING DISTANCE</span>
                <div class="val-row" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                  <span id="calc-total-stopping" style="font-family: var(--font-mono); font-size: 3.2rem; font-weight: 900; color: #EDEFEF; line-height: 1;">48.2 m</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
                  <div>
                    <span class="data-label">BRAKING ENVELOPE</span>
                    <div id="calc-braking-dist" class="mono-readout" style="font-size: 1.2rem; font-weight: 700; color: #EDEFEF;">37.8 m</div>
                    <span class="body-small" style="font-size: 0.7rem;">Hydraulic wet-disc retarder</span>
                  </div>
                  <div>
                    <span class="data-label">REACTION TRAVEL</span>
                    <div id="calc-reaction-dist" class="mono-readout" style="font-size: 1.2rem; font-weight: 700; color: #EDEFEF;">10.4 m</div>
                    <span class="body-small" style="font-size: 0.7rem;">Distance during 1.5s lag</span>
                  </div>
                </div>

                <div style="margin-top: 1rem; background: rgba(239, 68, 68, 0.08); border: 1px solid var(--status-critical-border); padding: 0.75rem; border-radius: var(--radius-xs);">
                  <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #EF4444; font-weight: 700; margin-bottom: 2px;">
                    CRITICAL FOG SIGHTLINE DEFICIT:
                  </div>
                  <p style="font-size: 0.78rem; line-height: 1.45; color: var(--text-secondary);">
                    In dense radiation fog (&lt;15m visibility), a driver cannot physically see the obstacle before the point of no return. FOSAFE acoustic ranging and radar buffers overcome this sightline deficit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Arbitration Matrix Table -->
          <div class="tech-panel">
            <div class="tech-header">
              <span class="tech-title">MULTI-TIER RISK ARBITRATION MATRIX</span>
              <span class="telemetry-tag normal">DETERMINISTIC RULES</span>
            </div>

            <table class="sensor-spec-table" style="margin-top: 0.75rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-medium);">
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">ZONE STATUS</th>
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">RANGE CRITERIA</th>
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">TIME-TO-IMPACT</th>
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">CAB ALERT BEHAVIOR</th>
                  <th style="text-align: left; padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">CONTROL ROOM ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="telemetry-tag normal">NORMAL</span></td>
                  <td>Distance &gt; 50.0m</td>
                  <td>TTI &gt; 6.0s</td>
                  <td>Green radar indicator; background telemetry polling</td>
                  <td>Roster logs routine haul progression</td>
                </tr>
                <tr>
                  <td><span class="telemetry-tag warning">ADVISORY</span></td>
                  <td>25.0m &lt; Distance &le; 50.0m</td>
                  <td>3.5s &lt; TTI &le; 6.0s</td>
                  <td>Amber radar ring highlights target vehicle ID</td>
                  <td>Haul corridor marked with caution advisory</td>
                </tr>
                <tr>
                  <td><span class="telemetry-tag warning">WARNING</span></td>
                  <td>10.0m &lt; Distance &le; 25.0m</td>
                  <td>1.8s &lt; TTI &le; 3.5s</td>
                  <td>Pulsing amber HUD banner; 1kHz intermittent acoustic tone</td>
                  <td>Automatic dispatcher proximity prompt</td>
                </tr>
                <tr>
                  <td><span class="telemetry-tag critical">CRITICAL</span></td>
                  <td>Distance &le; 10.0m</td>
                  <td>TTI &le; 1.8s</td>
                  <td>Red flashing screen; 2.5kHz continuous alarm; external strobe</td>
                  <td>Emergency incident log with coordinate capture</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}
