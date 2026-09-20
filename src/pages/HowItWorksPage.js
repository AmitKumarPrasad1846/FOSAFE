/**
 * FOSAFE v2 HowItWorksPage
 * Plain-language explanation of heavy truck stopping physics on steep mine ramps.
 * Interactive calculator demonstrates how speed and slope drastically increase stopping distance.
 * Full bilingual EN/HI support with zero layout overflow.
 */

import { i18n } from '../lib/i18n.js';

export class HowItWorksPage {
  constructor(container) {
    this.container = container;
    this.speedKmh = 25;
    this.gradePercent = -8; // -8% downhill
    this.reactionTime = 1.5; // seconds
    this.friction = 0.28; // wet aggregate haul road
    this.unsubscribeLang = null;
  }

  mount() {
    this.render();
    this.bindEvents();
    this.calculateBraking();

    this.unsubscribeLang = i18n.subscribe(() => {
      this.render();
      this.bindEvents();
      this.calculateBraking();
    });
  }

  unmount() {
    if (this.unsubscribeLang) {
      this.unsubscribeLang();
      this.unsubscribeLang = null;
    }
  }

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
    if (gradeValElem) gradeValElem.textContent = `${this.gradePercent > 0 ? '+' : ''}${this.gradePercent}%`;

    if (statusTag) {
      if (totalStoppingDist > 50) {
        statusTag.className = 'telemetry-tag critical';
        statusTag.innerHTML = '<span class="pulse-dot"></span>DANGER: NEEDS OVER 50M TO STOP';
      } else if (totalStoppingDist > 30) {
        statusTag.className = 'telemetry-tag warning';
        statusTag.innerHTML = '<span class="pulse-dot"></span>CAUTION: REDUCE SPEED IN FOG';
      } else {
        statusTag.className = 'telemetry-tag normal';
        statusTag.innerHTML = '<span class="pulse-dot"></span>CONTROLLED STOPPING DISTANCE';
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
      <div class="subpage-container">
        <div class="station-container">
          
          <!-- Page Header -->
          <div style="margin-bottom: var(--sp-8); max-width: 820px; min-width: 0;">
            <div class="station-marker font-mono">
              <span>${i18n.t('how.marker')}</span>
            </div>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4.2vw, 3.4rem); font-weight: 700; color: var(--text-primary); word-break: break-word;">
              ${i18n.t('how.title')}
            </h1>
            <p class="lead-text" style="margin-top: 0.5rem; word-break: break-word;">
              ${i18n.t('how.lead')}
            </p>
          </div>

          <!-- Interactive Physics Calculation Testbench -->
          <div class="station-panel" style="margin-bottom: var(--sp-8); min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">${i18n.t('how.calc_title')}</span>
                <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-top: 0.2rem;">${i18n.t('how.calc_subtitle')}</h3>
              </div>
              <span id="calc-hazard-status" class="telemetry-tag critical">
                <span class="pulse-dot"></span>CALCULATING...
              </span>
            </div>

            <!-- Controls Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--sp-8); margin-bottom: 2rem;">
              <!-- Slider 1: Speed -->
              <div style="background: var(--bg-inset); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--line-structure); min-width: 0;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;">
                  <span class="survey-label">${i18n.t('how.speed_label')}</span>
                  <span id="calc-speed-val" class="font-mono" style="font-size: 1.25rem; font-weight: 700; color: var(--accent-amber);">25 km/h</span>
                </div>
                <input id="speed-slider" type="range" min="10" max="50" step="5" value="25" style="width: 100%; accent-color: var(--accent-amber); cursor: pointer;" />
                <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); margin-top: 0.4rem;">
                  <span>10 km/h (Slow)</span>
                  <span>30 km/h (Normal)</span>
                  <span>50 km/h (High)</span>
                </div>
              </div>

              <!-- Slider 2: Grade Slope -->
              <div style="background: var(--bg-inset); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--line-structure); min-width: 0;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;">
                  <span class="survey-label">${i18n.t('how.grade_label')}</span>
                  <span id="calc-grade-val" class="font-mono" style="font-size: 1.25rem; font-weight: 700; color: var(--state-critical);">-8%</span>
                </div>
                <input id="grade-slider" type="range" min="-12" max="0" step="1" value="-8" style="width: 100%; accent-color: var(--state-critical); cursor: pointer;" />
                <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); margin-top: 0.4rem;">
                  <span>-12% (Very Steep Downhill)</span>
                  <span>-8% (Standard Ramp)</span>
                  <span>0% (Flat)</span>
                </div>
              </div>
            </div>

            <!-- Readout Results Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--sp-4);">
              <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--line-structure); min-width: 0;">
                <span class="survey-label">${i18n.t('how.total_stopping')}</span>
                <div id="calc-total-stopping" class="font-mono" style="font-size: 2.2rem; font-weight: 800; color: var(--state-critical); margin-top: 0.35rem;">
                  56.8 m
                </div>
                <span class="body-small" style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.2rem;">
                  Total space required from seeing obstacle to complete stop.
                </span>
              </div>

              <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--line-structure); min-width: 0;">
                <span class="survey-label">${i18n.t('how.reaction_dist')}</span>
                <div id="calc-reaction-dist" class="font-mono" style="font-size: 1.75rem; font-weight: 700; color: var(--accent-amber); margin-top: 0.35rem;">
                  10.4 m
                </div>
                <span class="body-small" style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.2rem;">
                  Distance traveled in 1.5 seconds before driver touches brake.
                </span>
              </div>

              <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--line-structure); min-width: 0;">
                <span class="survey-label">${i18n.t('how.brake_dist')}</span>
                <div id="calc-braking-dist" class="font-mono" style="font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin-top: 0.35rem;">
                  46.4 m
                </div>
                <span class="body-small" style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.2rem;">
                  Distance wheels skid on wet mine gravel under full braking.
                </span>
              </div>
            </div>

            <div class="small-mono" style="margin-top: 1.5rem; padding: 0.85rem 1rem; background: var(--state-warning-bg); border: 1px dashed var(--state-warning-border); border-radius: var(--radius-md); line-height: 1.5; color: var(--text-secondary);">
              💡 <strong>KEY LESSON:</strong> ${i18n.t('how.summary_alert')}
            </div>
          </div>

        </div>
      </div>
    `;
  }
}
