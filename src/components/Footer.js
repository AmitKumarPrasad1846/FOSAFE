/**
 * FOSAFE v2 Industrial Specification Footer
 * Technical disclosure, system architecture index, standards reference.
 * Fully supports Dark and Light modes and bilingual EN/HI updates.
 */

import { i18n } from '../lib/i18n.js';

export class Footer {
  constructor(footerElement) {
    this.footer = footerElement;
    this.init();
  }

  init() {
    this.render();
    i18n.subscribe(() => {
      this.render();
    });
  }

  render() {
    this.footer.innerHTML = `
      <div style="max-width: 1320px; margin: 0 auto; padding: 0 var(--sp-6); min-width: 0; width: 100%;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--sp-8); padding-bottom: var(--sp-12); border-bottom: 1px solid var(--line-structure); min-width: 0;">
          <!-- Col 1: System Identity -->
          <div style="min-width: 0; word-break: break-word;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--text-primary); letter-spacing: 0.08em;">
                FOSAFE
              </span>
            </div>
            <p style="font-size: 0.85rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 1.25rem; max-width: 360px;">
              Fog-Aware Safety &amp; Fleet Monitoring System for open-cast mines. Protecting heavy trucks and drivers in zero-visibility fog.
            </p>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.65rem; background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-capsule); font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary);">
              <span class="capsule-status-dot" style="background: var(--accent-amber);"></span>
              <span>SMART MINE SAFETY // v2.1</span>
            </div>
          </div>

          <!-- Col 2: Navigation -->
          <div style="min-width: 0;">
            <div class="survey-label" style="margin-bottom: 0.75rem;">SYSTEM PLATFORM</div>
            <ul style="display: flex; flex-direction: column; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.8rem;">
              <li><a href="/technology" data-link style="color: var(--text-secondary); text-decoration: none;">${i18n.t('nav.tech')}</a></li>
              <li><a href="/how-it-works" data-link style="color: var(--text-secondary); text-decoration: none;">${i18n.t('nav.physics')}</a></li>
              <li><a href="/platform" data-link style="color: var(--text-secondary); text-decoration: none;">${i18n.t('nav.platform')}</a></li>
              <li><a href="/about" data-link style="color: var(--text-secondary); text-decoration: none;">${i18n.t('nav.about')}</a></li>
            </ul>
          </div>

          <!-- Col 3: Collaboration -->
          <div style="min-width: 0;">
            <div class="survey-label" style="margin-bottom: 0.75rem;">DEPLOYMENT</div>
            <ul style="display: flex; flex-direction: column; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.8rem;">
              <li><a href="/collaboration" data-link style="color: var(--text-secondary); text-decoration: none;">Mine Field Pilots</a></li>
              <li><a href="/collaboration" data-link style="color: var(--text-secondary); text-decoration: none;">24V Vehicle Retrofits</a></li>
              <li><a href="/login" data-link style="color: var(--text-secondary); text-decoration: none;">${i18n.t('nav.access')}</a></li>
            </ul>
          </div>

          <!-- Col 4: Safety Compliance -->
          <div style="min-width: 0; word-break: break-word;">
            <div class="survey-label" style="margin-bottom: 0.75rem;">SAFETY STANDARDS</div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.65rem;">
              <div>
                <strong style="color: var(--text-primary); display: block; margin-bottom: 2px;">DGMS GUIDELINE ALIGNED</strong>
                Proximity Warning Device for heavy mining machinery in open-cast pits.
              </div>
              <div>
                <strong style="color: var(--text-primary); display: block; margin-bottom: 2px;">ISO 21815 FRAMEWORK</strong>
                Collision awareness and avoidance architecture.
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-top: var(--sp-6); font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">
          <div>
            FOSAFE &copy; 2026 // Smart Mine Safety Initiative
          </div>
          <div>
            Open-Cast Mine Vehicle Awareness
          </div>
        </div>
      </div>
    `;
  }
}
