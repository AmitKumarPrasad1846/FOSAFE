/**
 * FOSAFE v2 LoginPage
 * Industrial Access Terminal: Simple role selector (Driver, Mine Dispatcher, Engineer)
 * with instant one-click demonstration access to the platform.
 * Full bilingual EN/HI support and theme adaptability.
 */

import { i18n } from '../lib/i18n.js';

export class LoginPage {
  constructor(container, router) {
    this.container = container;
    this.router = router;
    this.selectedRole = 'operator';
    this.unsubscribeLang = null;
  }

  mount() {
    this.render();
    this.bindEvents();

    this.unsubscribeLang = i18n.subscribe(() => {
      this.render();
      this.bindEvents();
    });
  }

  unmount() {
    if (this.unsubscribeLang) {
      this.unsubscribeLang();
      this.unsubscribeLang = null;
    }
  }

  selectRole(role) {
    this.selectedRole = role;
    this.render();
    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll('[data-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        this.selectRole(role);
      });
    });

    const form = this.container.querySelector('#portal-auth-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'CONNECTING...';
          submitBtn.style.opacity = '0.7';
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          if (this.router) {
            this.router.navigate('/platform');
          }
        }, 350);
      });
    }
  }

  render() {
    const roles = {
      operator: {
        id: 'operator',
        badge: 'ROLE 01 // IN-CAB',
        title: 'Truck Driver Screen',
        unitDefault: 'HAUL TRUCK D-07 [400t]',
        zoneDefault: 'RAMP 04 (HAIRPIN CURVE)',
        desc: 'In-cab 360° radar screen, proximity warnings, and Fog Assist button.'
      },
      dispatch: {
        id: 'dispatch',
        badge: 'ROLE 02 // CONTROL ROOM',
        title: 'Mine Dispatcher Ops',
        unitDefault: 'CENTRAL DISPATCH RADAR 01',
        zoneDefault: 'ALL MINE SECTORS',
        desc: 'Pit-wide live radar map, blind curve hazard alerts, and emergency radio.'
      },
      qa: {
        id: 'qa',
        badge: 'ROLE 03 // SAFETY ENGINEER',
        title: 'Safety Testing Simulator',
        unitDefault: 'OFFLINE TESTBENCH',
        zoneDefault: 'VIRTUAL DENSE FOG TRIAL',
        desc: 'Simulate virtual truck braking across 5,000 dense fog runs.'
      }
    };

    const current = roles[this.selectedRole] || roles.operator;

    this.container.innerHTML = `
      <div class="subpage-container" style="display: flex; align-items: center; justify-content: center; min-height: 85vh;">
        <div style="width: 100%; max-width: 520px; min-width: 0;">
          
          <div class="station-panel" style="min-width: 0; word-break: break-word;">
            <!-- Gateway Header -->
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
              <div>
                <span class="survey-label">${i18n.t('login.marker')}</span>
                <h2 style="font-size: 1.35rem; color: var(--text-primary); margin-top: 0.2rem;">${i18n.t('login.title')}</h2>
              </div>
              <span class="telemetry-tag normal"><span class="pulse-dot"></span>READY</span>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
              ${i18n.t('login.lead')}
            </p>

            <!-- Role Pills -->
            <div style="display: flex; gap: 0.4rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
              <button data-role="operator" class="capsule-nav-link ${this.selectedRole === 'operator' ? 'is-active' : ''}" style="flex: 1; min-width: 120px; text-align: center; padding: 0.5rem 0.6rem; cursor: pointer; border: 1px solid var(--line-structure);">
                ${i18n.t('login.role_operator')}
              </button>
              <button data-role="dispatch" class="capsule-nav-link ${this.selectedRole === 'dispatch' ? 'is-active' : ''}" style="flex: 1; min-width: 120px; text-align: center; padding: 0.5rem 0.6rem; cursor: pointer; border: 1px solid var(--line-structure);">
                ${i18n.t('login.role_dispatch')}
              </button>
              <button data-role="qa" class="capsule-nav-link ${this.selectedRole === 'qa' ? 'is-active' : ''}" style="flex: 1; min-width: 120px; text-align: center; padding: 0.5rem 0.6rem; cursor: pointer; border: 1px solid var(--line-structure);">
                ${i18n.t('login.role_qa')}
              </button>
            </div>

            <!-- Role Details Box -->
            <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <span class="survey-label" style="color: var(--accent-amber);">${current.badge}</span>
                <span class="capsule-status-dot"></span>
              </div>
              <h4 style="font-size: 1.05rem; color: var(--text-primary); margin-bottom: 0.35rem;">${current.title}</h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.75rem;">
                ${current.desc}
              </p>
              <div class="small-mono" style="display: flex; justify-content: space-between; border-top: 1px solid var(--line-subtle); padding-top: 0.5rem; color: var(--text-muted); font-size: 0.72rem;">
                <span>TARGET: ${current.unitDefault}</span>
                <span>ZONE: ${current.zoneDefault}</span>
              </div>
            </div>

            <!-- Fast Launch Form -->
            <form id="portal-auth-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <button type="submit" class="btn-action-primary" style="width: 100%; justify-content: center; padding: 0.85rem;">
                <span>${i18n.t('login.submit_btn')}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    `;
  }
}
