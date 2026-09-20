/**
 * FOSAFE v2 HomePage
 * One Continuous Journey Architecture: 10 Storyline Stations
 * High-tech background LiDAR Proximity Radar with plain, human-friendly copy
 * and seamless bilingual English / Hindi (हिन्दी) support.
 */

import { ExplodedVehicleUnit } from '../visualizations/ExplodedVehicleUnit.js';
import { VisibilitySimulator } from '../visualizations/VisibilitySimulator.js';
import { DriverConsolePreview } from '../visualizations/DriverConsolePreview.js';
import { MineControlRoomPreview } from '../visualizations/MineControlRoomPreview.js';
import { SafetyLogicPipeline } from '../visualizations/SafetyLogicPipeline.js';
import { PhysicalDigitalLoop } from '../visualizations/PhysicalDigitalLoop.js';
import { scrollManager } from '../lib/scroll.js';
import { i18n } from '../lib/i18n.js';

export class HomePage {
  constructor(container) {
    this.container = container;
    this.activeInstances = [];
    this.unsubscribeLang = null;
  }

  mount() {
    this.render();
    this.initStationComponents();
    this.bindInteractions();

    this.unsubscribeLang = i18n.subscribe(() => {
      this.refreshLanguage();
    });
  }

  unmount() {
    if (this.unsubscribeLang) {
      this.unsubscribeLang();
      this.unsubscribeLang = null;
    }

    this.destroyStationComponents();
  }

  destroyStationComponents() {
    this.activeInstances.forEach(instance => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    });
    this.activeInstances = [];
  }

  refreshLanguage() {
    const stationsContainer = this.container.querySelector('#storyline-stations');
    if (stationsContainer) {
      this.destroyStationComponents();
      stationsContainer.innerHTML = this.renderStationsHTML();
      this.initStationComponents();
      this.bindInteractions();
    }
  }

  initStationComponents() {
    const explodedMount = this.container.querySelector('#station-exploded-vehicle-mount');
    if (explodedMount) {
      const explodedUnit = new ExplodedVehicleUnit(explodedMount);
      this.activeInstances.push(explodedUnit);
    }

    const visMount = this.container.querySelector('#station-vis-simulator-mount');
    if (visMount) {
      const visSim = new VisibilitySimulator(visMount);
      this.activeInstances.push(visSim);
    }

    const consoleMount = this.container.querySelector('#station-driver-console-mount');
    if (consoleMount) {
      const consolePreview = new DriverConsolePreview(consoleMount);
      this.activeInstances.push(consolePreview);
    }

    const controlMount = this.container.querySelector('#station-control-room-mount');
    if (controlMount) {
      const controlRoom = new MineControlRoomPreview(controlMount);
      this.activeInstances.push(controlRoom);
    }

    const pipelineMount = this.container.querySelector('#station-pipeline-mount');
    if (pipelineMount) {
      const pipeline = new SafetyLogicPipeline(pipelineMount);
      this.activeInstances.push(pipeline);
    }

    const loopMount = this.container.querySelector('#station-hardware-loop-mount');
    if (loopMount) {
      const loop = new PhysicalDigitalLoop(loopMount);
      this.activeInstances.push(loop);
    }
  }

  bindInteractions() {
    const exploreBtn = this.container.querySelector('#hero-explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('station-02');
        if (target) scrollManager.scrollTo(target, { offset: -30 });
      });
    }
  }

  render() {
    this.container.innerHTML = `
      <!-- CONTINUOUS STORYLINE STATIONS CONTAINER -->
      <div class="storyline-container" id="storyline-stations">
        ${this.renderStationsHTML()}
      </div>
    `;
  }

  renderStationsHTML() {
    return `
      <!-- ===================================================================
           STATION 01: HERO // CLEAR ROAD SURVEY OVERVIEW
           =================================================================== -->
      <section id="station-01" class="station-section" aria-label="FOSAFE System Overview">
        <div class="station-container">
          <div class="station-split-left">
            <div class="station-panel hero-station-panel">
              <div class="station-marker font-mono">
                <span>${i18n.t('hero.marker')}</span>
              </div>

              <h1 class="hero-headline">
                ${i18n.t('hero.title_line1')}<br />${i18n.t('hero.title_line2')}
              </h1>

              <p class="hero-sub-text">
                ${i18n.t('hero.subtitle')}
              </p>

              <div class="hero-actions-row">
                <a href="/platform" data-link class="btn-action-primary">
                  <span>${i18n.t('hero.btn_platform')}</span>
                  <span>→</span>
                </a>
                <button id="hero-explore-btn" class="btn-action-secondary">
                  <span>${i18n.t('hero.btn_scroll')}</span>
                </button>
              </div>

              <!-- Primary Vehicle Readout Strip -->
              <div class="hero-readout-strip font-mono" role="region" aria-label="Target Telemetry Readout">
                <div class="hero-readout-col">
                  <span class="col-label">${i18n.t('hero.card_primary')}</span>
                  <div class="col-val">D-07</div>
                  <span class="col-sub">${i18n.t('hero.card_primary_sub')}</span>
                </div>
                <div class="hero-readout-col">
                  <span class="col-label">${i18n.t('hero.card_distance')}</span>
                  <div class="col-val" style="color: var(--accent-amber);">${i18n.t('hero.card_distance_val')}</div>
                  <span class="col-sub">${i18n.t('hero.card_distance_sub')}</span>
                </div>
                <div class="hero-readout-col">
                  <span class="col-label">${i18n.t('hero.card_status')}</span>
                  <div class="col-val" style="color: var(--state-warning); font-size: 0.95rem; margin-top: 4px;">
                    ${i18n.t('hero.card_status_val')}
                  </div>
                  <span class="col-sub">${i18n.t('hero.card_status_sub')}</span>
                </div>
              </div>
            </div>

            <div class="station-spacer" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STATION 02: THE PROBLEM // LOW VISIBILITY COLLAPSE
           =================================================================== -->
      <section id="station-02" class="station-section" aria-label="The Mine Haul Road Problem">
        <div class="station-container">
          <div class="station-split-right">
            <div class="station-spacer" aria-hidden="true"></div>

            <div class="station-panel">
              <div class="station-marker font-mono">
                <span>${i18n.t('s02.marker')}</span>
              </div>

              <h2>${i18n.t('s02.title')}</h2>

              <p class="lead-text" style="margin-top: 0.5rem;">
                ${i18n.t('s02.lead')}
              </p>

              <p>
                ${i18n.t('s02.p1')}
              </p>

              <!-- Comparison Box: Braking vs Sight Distance -->
              <div class="problem-comparison-box font-mono">
                <div class="comparison-card critical">
                  <div class="survey-label" style="color: var(--state-critical);">${i18n.t('s02.card1_label')}</div>
                  <div class="instrument-readout" style="margin-top: 0.35rem;">
                    <span class="instrument-val" style="color: var(--state-critical);">62.4</span>
                    <span class="unit-suffix">m</span>
                  </div>
                  <div class="small-mono" style="margin-top: 0.25rem;">${i18n.t('s02.card1_sub')}</div>
                </div>

                <div class="comparison-card">
                  <div class="survey-label" style="color: var(--accent-amber);">${i18n.t('s02.card2_label')}</div>
                  <div class="instrument-readout" style="margin-top: 0.35rem;">
                    <span class="instrument-val" style="color: var(--accent-amber);">&lt; 15.0</span>
                    <span class="unit-suffix">m</span>
                  </div>
                  <div class="small-mono" style="margin-top: 0.25rem;">${i18n.t('s02.card2_sub')}</div>
                </div>
              </div>

              <div class="small-mono" style="margin-top: var(--sp-4); padding: 0.75rem 1rem; background: var(--bg-inset); border: 1px solid var(--line-subtle); border-radius: var(--radius-md); line-height: 1.5;">
                ⚠️ <strong>${i18n.t('s02.alert')}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STATION 03: THE APPROACH // 4-STEP SAFETY ARCHITECTURE
           =================================================================== -->
      <section id="station-03" class="station-section" aria-label="The FOSAFE Approach">
        <div class="station-container">
          <div class="station-full">
            <div class="station-marker font-mono">
              <span>${i18n.t('s03.marker')}</span>
            </div>
            <h2>${i18n.t('s03.title')}</h2>
            <p class="lead-text" style="max-width: 680px; margin-top: 0.4rem;">
              ${i18n.t('s03.lead')}
            </p>

            <!-- Stepped Horizontal Sequence -->
            <div class="approach-sequence-grid">
              <div class="approach-step-card">
                <div>
                  <div class="step-idx">01 // STEP ONE</div>
                  <div class="step-title">${i18n.t('s03.step1_title')}</div>
                  <p class="step-desc">
                    ${i18n.t('s03.step1_desc')}
                  </p>
                </div>
                <div class="small-mono">${i18n.t('s03.step1_tag')}</div>
              </div>

              <div class="approach-step-card">
                <div>
                  <div class="step-idx">02 // STEP TWO</div>
                  <div class="step-title">${i18n.t('s03.step2_title')}</div>
                  <p class="step-desc">
                    ${i18n.t('s03.step2_desc')}
                  </p>
                </div>
                <div class="small-mono">${i18n.t('s03.step2_tag')}</div>
              </div>

              <div class="approach-step-card">
                <div>
                  <div class="step-idx">03 // STEP THREE</div>
                  <div class="step-title">${i18n.t('s03.step3_title')}</div>
                  <p class="step-desc">
                    ${i18n.t('s03.step3_desc')}
                  </p>
                </div>
                <div class="small-mono">${i18n.t('s03.step3_tag')}</div>
              </div>

              <div class="approach-step-card">
                <div>
                  <div class="step-idx">04 // STEP FOUR</div>
                  <div class="step-title">${i18n.t('s03.step4_title')}</div>
                  <p class="step-desc">
                    ${i18n.t('s03.step4_desc')}
                  </p>
                </div>
                <div class="small-mono">${i18n.t('s03.step4_tag')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STATION 04: THE VEHICLE // EXPLODED SENSOR BUS UNIT
           =================================================================== -->
      <section id="station-04" class="station-section" aria-label="Vehicle Unit Architecture">
        <div class="station-container">
          <div class="station-full">
            <div style="margin-bottom: var(--sp-6);">
              <div class="station-marker font-mono">
                <span>${i18n.t('s04.marker')}</span>
              </div>
              <h2>${i18n.t('s04.title')}</h2>
              <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                ${i18n.t('s04.lead')}
              </p>
            </div>

            <!-- Interactive Exploded Unit Mount -->
            <div id="station-exploded-vehicle-mount"></div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STATION 05: LOW-VISIBILITY INTELLIGENCE // ADAPTIVE BUFFERS
           =================================================================== -->
      <section id="station-05" class="station-section" aria-label="Low-Visibility Intelligence">
        <div class="station-container">
          <div class="station-full">
            <div style="margin-bottom: var(--sp-6);">
              <div class="station-marker font-mono">
                <span>${i18n.t('s05.marker')}</span>
              </div>
              <h2>${i18n.t('s05.title')}</h2>
              <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                ${i18n.t('s05.lead')}
              </p>
            </div>

            <!-- Interactive Visibility Simulator Mount -->
            <div id="station-vis-simulator-mount"></div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STATION 06: DRIVER SAFETY CONSOLE // COCKPIT HUD
           =================================================================== -->
      <section id="station-06" class="station-section" aria-label="Driver Safety Console">
        <div class="station-container">
          <div class="station-full">
            <div style="margin-bottom: var(--sp-6);">
              <div class="station-marker font-mono">
                <span>${i18n.t('s06.marker')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 1rem;">
                <h2>${i18n.t('s06.title')}</h2>
                <span class="provenance-tag live">${i18n.t('s06.tag')}</span>
              </div>
              <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                ${i18n.t('s06.lead')}
              </p>
            </div>

            <!-- Driver Console Mount -->
            <div id="station-driver-console-mount"></div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STATION 07: MINE CONTROL ROOM // DISPATCH SIMULATION
           =================================================================== -->
      <section id="station-07" class="station-section" aria-label="Mine Fleet Control Room">
        <div class="station-container">
          <div class="station-full">
            <div style="margin-bottom: var(--sp-6);">
              <div class="station-marker font-mono">
                <span>${i18n.t('s07.marker')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 1rem;">
                <h2>${i18n.t('s07.title')}</h2>
                <span class="provenance-tag sim">${i18n.t('s07.tag')}</span>
              </div>
              <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                ${i18n.t('s07.lead')}
              </p>
            </div>

            <!-- Control Room Mount -->
            <div id="station-control-room-mount"></div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STATION 08: REAL-TIME SAFETY LOGIC CHAIN
           =================================================================== -->
      <section id="station-08" class="station-section" aria-label="Safety Logic Pipeline">
        <div class="station-container">
          <div class="station-full">
            <div style="margin-bottom: var(--sp-6);">
              <div class="station-marker font-mono">
                <span>${i18n.t('s08.marker')}</span>
              </div>
              <h2>${i18n.t('s08.title')}</h2>
              <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                ${i18n.t('s08.lead')}
              </p>
            </div>

            <!-- Safety Logic Pipeline Mount -->
            <div id="station-pipeline-mount"></div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STATION 09: PHYSICAL + DIGITAL HARDWARE LOOP
           =================================================================== -->
      <section id="station-09" class="station-section" aria-label="Physical Digital Loop">
        <div class="station-container">
          <div class="station-full">
            <div style="margin-bottom: var(--sp-6);">
              <div class="station-marker font-mono">
                <span>${i18n.t('s09.marker')}</span>
              </div>
              <h2>${i18n.t('s09.title')}</h2>
              <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
                ${i18n.t('s09.lead')}
              </p>
            </div>

            <!-- Hardware Loop Mount -->
            <div id="station-hardware-loop-mount"></div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STATION 10: PLATFORM TIERS & FIELD TRIALS COLLABORATION
           =================================================================== -->
      <section id="station-10" class="station-section" aria-label="Platform Tiers and Collaboration">
        <div class="station-container">
          <div class="station-full">
            <div class="station-marker font-mono">
              <span>${i18n.t('s10.marker')}</span>
            </div>
            <h2>${i18n.t('s10.title')}</h2>
            <p class="lead-text" style="max-width: 720px; margin-top: 0.4rem;">
              ${i18n.t('s10.lead')}
            </p>

            <!-- Operational Tiers Grid -->
            <div class="platform-tiers-grid">
              <div class="tier-card">
                <div>
                  <div class="tier-card-header">
                    <span class="survey-label">${i18n.t('s10.tier1_label')}</span>
                    <span class="provenance-tag live">LIVE HARDWARE</span>
                  </div>
                  <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">${i18n.t('s10.tier1_title')}</h3>
                  <p style="font-size: 0.85rem; line-height: 1.55;">
                    ${i18n.t('s10.tier1_desc')}
                  </p>
                </div>
                <div class="small-mono" style="margin-top: 0.75rem; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem;">
                  • ${i18n.t('s10.tier1_tag')}
                </div>
              </div>

              <div class="tier-card">
                <div>
                  <div class="tier-card-header">
                    <span class="survey-label">${i18n.t('s10.tier2_label')}</span>
                    <span class="provenance-tag sim">SIMULATION</span>
                  </div>
                  <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">${i18n.t('s10.tier2_title')}</h3>
                  <p style="font-size: 0.85rem; line-height: 1.55;">
                    ${i18n.t('s10.tier2_desc')}
                  </p>
                </div>
                <div class="small-mono" style="margin-top: 0.75rem; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem;">
                  • ${i18n.t('s10.tier2_tag')}
                </div>
              </div>

              <div class="tier-card">
                <div>
                  <div class="tier-card-header">
                    <span class="survey-label">${i18n.t('s10.tier3_label')}</span>
                    <span class="provenance-tag sim">SIMULATION</span>
                  </div>
                  <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">${i18n.t('s10.tier3_title')}</h3>
                  <p style="font-size: 0.85rem; line-height: 1.55;">
                    ${i18n.t('s10.tier3_desc')}
                  </p>
                </div>
                <div class="small-mono" style="margin-top: 0.75rem; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem;">
                  • ${i18n.t('s10.tier3_tag')}
                </div>
              </div>
            </div>

            <!-- Collaboration Engagement Paths -->
            <div class="collab-specs-grid" style="margin-top: var(--sp-6);">
              <div class="collab-spec-box">
                <div class="survey-label survey-label-amber">${i18n.t('s10.spec1_title')}</div>
                <p style="font-size: 0.82rem; margin-top: 0.35rem; margin-bottom: 0;">
                  ${i18n.t('s10.spec1_desc')}
                </p>
              </div>
              <div class="collab-spec-box">
                <div class="survey-label survey-label-amber">${i18n.t('s10.spec2_title')}</div>
                <p style="font-size: 0.82rem; margin-top: 0.35rem; margin-bottom: 0;">
                  ${i18n.t('s10.spec2_desc')}
                </p>
              </div>
              <div class="collab-spec-box">
                <div class="survey-label survey-label-amber">${i18n.t('s10.spec3_title')}</div>
                <p style="font-size: 0.82rem; margin-top: 0.35rem; margin-bottom: 0;">
                  ${i18n.t('s10.spec3_desc')}
                </p>
              </div>
              <div class="collab-spec-box">
                <div class="survey-label survey-label-amber">${i18n.t('s10.spec4_title')}</div>
                <p style="font-size: 0.82rem; margin-top: 0.35rem; margin-bottom: 0;">
                  ${i18n.t('s10.spec4_desc')}
                </p>
              </div>
            </div>

            <!-- Call to Action Banner -->
            <div class="station-panel" style="margin-top: var(--sp-8); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
              <div>
                <div class="survey-label" style="color: var(--accent-amber);">SYSTEM ACCESS</div>
                <h3 style="font-size: 1.5rem; color: var(--text-primary); margin-top: 0.25rem;">
                  ${i18n.t('s10.cta_title')}
                </h3>
                <p style="font-size: 0.88rem; margin-top: 0.25rem; margin-bottom: 0; max-width: 540px;">
                  ${i18n.t('s10.cta_desc')}
                </p>
              </div>
              <div style="display: flex; gap: 0.75rem; flex-shrink: 0; flex-wrap: wrap;">
                <a href="/login" data-link class="btn-action-primary">${i18n.t('s10.cta_launch')}</a>
                <a href="/technology" data-link class="btn-action-secondary">${i18n.t('s10.cta_specs')}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
