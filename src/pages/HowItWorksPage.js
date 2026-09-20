/**
 * FOSAFE v2 HowItWorksPage
 * Mathematical safety envelope calculations, stopping dynamics on mine ramps,
 * and interactive physics calculation test bench.
 * Fully responsive and supports Dark and Light modes.
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
    const v = (this.speedKmh * 1000) / 3600;
    const g = 9.81;
    const theta = Math.atan(this.gradePercent / 100);
    
    const effectiveDecel = g * (this.friction + Math.sin(theta));
    const safeDecel = Math.max(effectiveDecel, 0.4);
    const brakingDist = (v * v) / (2 * safeDecel);
    const reactionDist = v * this.reactionTime;
    const totalStoppingDist = brakingDist + reactionDist;

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
        statusTag.innerHTML = '<span class="pulse-dot"></span>CRITICAL STOPPING DEFICIT';
      } else if (totalStoppingDist > 30) {
        statusTag.className = 'telemetry-tag warning';
        statusTag.innerHTML = '<span class="pulse-dot"></span>ELEVATED HAZARD BUFFER';
      } else {
        statusTag.className = 'telemetry-tag normal';
        statusTag.innerHTML = '<span class="pulse-dot"></span>CONTROLLED STOPPING';
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
      <div style="padding: calc(64px + var(--sp-8)) var(--sp-6) var(--sp-20);">
        <div style="max-width: 1320px; margin: 0 auto;">
          <!-- Page Title -->
          <div style="margin-bottom: var(--sp-8); max-width: 820px;">
            <div class="station-marker font-mono">
              <span>HAULAGE KINEMATICS // ARBITRATION</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2.2rem, 4.5vw, 3.8rem); font-weight: 700; color: var(--text-primary);">
              How FOSAFE Arbitrates Risk
            </h1>
            <p class="lead-text" style="margin-top: 0.5rem;">
              Understanding heavy haulage stopping dynamics on steep ramps, and how FOSAFE fuses multi-sensor telemetry to trigger deterministic warnings before sightlines collapse.
            </p>
          </div>

          <!-- Interactive Physics Calculation Testbench -->
          <div class="station-panel" style="margin-bottom: var(--sp-8);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">PHYSICS TESTBENCH</span>
                <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-top: 0.2rem;">Stopping Distance Simulator</h3>
              </div>
              <span id="calc-hazard-status" class="telemetry-tag warning"><span class="pulse-dot"></span>ELEVATED HAZARD BUFFER</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--sp-8); align-items: start;">
              <!-- Left: Sliders & Fixed Parameters -->
              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="survey-label">HAUL TRUCK SPEED</span>
                    <span id="calc-speed-val" class="font-mono" style="font-size: 1.05rem; font-weight: 700; color: var(--accent-amber);">25 km/h</span>
                  </div>
                  <input type="range" id="speed-slider" min="10" max="40" value="25" step="1" style="width: 100%; accent-color: var(--accent-amber); cursor: pointer;" />
                  <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">
                    <span>10 km/h (Crawl)</span>
                    <span>25 km/h (Standard)</span>
                    <span>40 km/h (Max)</span>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="survey-label">RAMP GRADIENT</span>
                    <span id="calc-grade-val" class="font-mono" style="font-size: 1.05rem; font-weight: 700; color: var(--accent-amber);">-8% Grade</span>
                  </div>
                  <input type="range" id="grade-slider" min="-12" max="6" value="-8" step="1" style="width: 100%; accent-color: var(--accent-amber); cursor: pointer;" />
                  <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">
                    <span>-12% (Descent)</span>
                    <span>-8% (Ramp)</span>
                    <span>+6% (Ascent)</span>
                  </div>
                </div>

                <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 1rem 1.25rem; border-radius: var(--radius-md); box-shadow: var(--card-shadow);">
                  <div class="survey-label" style="margin-bottom: 0.35rem;">BENCHMARK ASSUMPTIONS</div>
                  <div class="small-mono" style="color: var(--text-secondary); line-height: 1.6;">
                    • Gross Vehicle Weight: <strong style="color: var(--text-primary);">400 Tons</strong><br/>
                    • Surface Friction (&mu;): <strong style="color: var(--text-primary);">0.28</strong> (Wet crushed haul aggregate)<br/>
                    • Operator Reaction Lag: <strong style="color: var(--text-primary);">1.5s</strong>
                  </div>
                </div>
              </div>

              <!-- Right: Calculated Results Card -->
              <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-lg); padding: 1.75rem; box-shadow: var(--card-shadow);">
                <span class="survey-label" style="color: var(--accent-amber);">REQUIRED STOPPING DISTANCE</span>
                <div style="margin-top: 0.35rem; margin-bottom: 1rem;">
                  <span id="calc-total-stopping" style="font-family: var(--font-mono); font-size: 3.2rem; font-weight: 800; color: var(--text-primary); line-height: 1;">48.2 m</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--line-subtle); padding-top: 1rem;">
                  <div>
                    <span class="survey-label">BRAKING ENVELOPE</span>
                    <div id="calc-braking-dist" class="font-mono" style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">37.8 m</div>
                    <span class="small-mono" style="color: var(--text-muted); font-size: 0.7rem;">Hydraulic wet-disc retarder</span>
                  </div>
                  <div>
                    <span class="survey-label">REACTION TRAVEL</span>
                    <div id="calc-reaction-dist" class="font-mono" style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">10.4 m</div>
                    <span class="small-mono" style="color: var(--text-muted); font-size: 0.7rem;">Distance during 1.5s lag</span>
                  </div>
                </div>

                <div style="margin-top: 1.25rem; background: var(--state-critical-bg); border: 1px solid var(--state-critical-border); padding: 0.85rem 1rem; border-radius: var(--radius-md);">
                  <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--state-critical); font-weight: 700; margin-bottom: 2px;">
                    FOG SIGHTLINE DEFICIT:
                  </div>
                  <p style="font-size: 0.8rem; line-height: 1.45; color: var(--text-secondary); margin: 0;">
                    In radiation fog (&lt;15m visibility), drivers reach the point of no return before visually seeing obstacles. FOSAFE acoustic ranging and radar buffers overcome this deficit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Arbitration Matrix Table -->
          <div class="station-panel">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">SAFETY THRESHOLDS</span>
                <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-top: 0.2rem;">Multi-Tier Risk Arbitration Matrix</h3>
              </div>
              <span class="provenance-tag live">DETERMINISTIC RULES</span>
            </div>

            <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
              <table style="width: 100%; border-collapse: collapse; min-width: 720px; font-size: 0.85rem;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--line-strong); text-align: left;">
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">ZONE STATUS</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">RANGE CRITERIA</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">TIME-TO-IMPACT</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">CAB ALERT BEHAVIOR</th>
                    <th style="padding: 0.75rem 0.5rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">CONTROL ROOM ACTION</th>
                  </tr>
                </thead>
                <tbody class="font-mono">
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.75rem 0.5rem;"><span class="telemetry-tag normal">NORMAL</span></td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">Distance &gt; 50.0m</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">TTI &gt; 6.0s</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">Green radar indicator; background polling</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-muted);">Routine haul progression logged</td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.75rem 0.5rem;"><span class="telemetry-tag warning">ADVISORY</span></td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">25.0m &lt; Dist &le; 50.0m</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">3.5s &lt; TTI &le; 6.0s</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">Amber radar ring highlights target unit</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-muted);">Haul corridor marked with advisory</td>
                  </tr>
                  <tr style="border-bottom: 1px solid var(--line-subtle);">
                    <td style="padding: 0.75rem 0.5rem;"><span class="telemetry-tag warning">WARNING</span></td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">10.0m &lt; Dist &le; 25.0m</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">1.8s &lt; TTI &le; 3.5s</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">Pulsing amber HUD banner; 1kHz tone</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-muted);">Dispatcher proximity prompt fired</td>
                  </tr>
                  <tr>
                    <td style="padding: 0.75rem 0.5rem;"><span class="telemetry-tag critical">CRITICAL</span></td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-primary); font-weight: 700;">Distance &le; 10.0m</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--state-critical); font-weight: 700;">TTI &le; 1.8s</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--state-critical);">Red flashing HUD; 2.5kHz alarm; strobe</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--text-muted);">Emergency incident log with GPS fix</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
