/**
 * FOSAFE v2 LoginPage
 * Industrial Access Terminal for In-Cab Operator, Dispatcher Ops,
 * and Simulation Engineers with instant demonstration mode.
 * Fully supports Dark and Light modes.
 */

export class LoginPage {
  constructor(container, router) {
    this.container = container;
    this.router = router;
    this.selectedRole = 'operator'; // 'operator' | 'dispatch' | 'qa'
  }

  mount() {
    this.render();
    this.bindEvents();
  }

  unmount() {}

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
          submitBtn.textContent = 'AUTHENTICATING TOKEN...';
          submitBtn.style.opacity = '0.7';
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          if (this.router) {
            this.router.navigate('/platform');
          }
        }, 600);
      });
    }
  }

  render() {
    const roles = {
      operator: {
        id: 'operator',
        badge: 'VEHICLE CAB // ROLE 01',
        title: 'Haul Truck Driver Console',
        unitDefault: 'UNIT D-07 [CAT 797F]',
        zoneDefault: 'RAMP 04 BENCH B',
        color: 'var(--accent-amber)',
        desc: 'Accesses localized in-cab proximity radar, forward obstacle readouts, and Fog Assist beacon controls.'
      },
      dispatch: {
        id: 'dispatch',
        badge: 'DISPATCH OPS // ROLE 02',
        title: 'Mine Fleet Operations Center',
        unitDefault: 'CENTRAL DISPATCH CONSOLE 01',
        zoneDefault: 'ALL PIT SECTORS (01–06)',
        color: 'var(--state-normal)',
        desc: 'Accesses pit-wide topographical radar, active hazard alerts, and real-time fleet risk indices.'
      },
      qa: {
        id: 'qa',
        badge: 'ENGINEERING // ROLE 03',
        title: 'Simulation & Telematics Sandbox',
        unitDefault: 'OFFLINE QA TESTBENCH',
        zoneDefault: 'SYNTHETIC CONVERGENCE KERNEL',
        color: '#60A5FA',
        desc: 'Executes Monte Carlo traffic runs and stress tests risk arbitration algorithms in synthetic dense fog.'
      }
    };

    const current = roles[this.selectedRole];

    this.container.innerHTML = `
      <div style="padding: calc(64px + var(--sp-8)) var(--sp-6) var(--sp-20); display: flex; align-items: center; justify-content: center; min-height: 80vh;">
        <div style="width: 100%; max-width: 580px;">
          <!-- Gateway Box -->
          <div class="station-panel">
            <!-- Gateway Header -->
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--line-structure); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
              <div>
                <span class="survey-label">SECURITY PROTOCOL</span>
                <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-top: 0.2rem;">INDUSTRIAL ACCESS TERMINAL</h3>
              </div>
              <span class="telemetry-tag normal"><span class="pulse-dot"></span>PORTAL SECURED</span>
            </div>

            <!-- Role Selector Tabs -->
            <div style="display: flex; gap: 0.35rem; margin-bottom: 1.5rem;">
              <button class="capsule-nav-link ${this.selectedRole === 'operator' ? 'is-active' : ''}" data-role="operator" style="flex: 1; text-align: center; padding: 0.5rem; border: 1px solid ${this.selectedRole === 'operator' ? 'var(--accent-amber)' : 'var(--line-structure)'}; background: ${this.selectedRole === 'operator' ? 'var(--capsule-pill-active)' : 'var(--bg-inset)'}; cursor: pointer;">
                OPERATOR
              </button>
              <button class="capsule-nav-link ${this.selectedRole === 'dispatch' ? 'is-active' : ''}" data-role="dispatch" style="flex: 1; text-align: center; padding: 0.5rem; border: 1px solid ${this.selectedRole === 'dispatch' ? 'var(--accent-amber)' : 'var(--line-structure)'}; background: ${this.selectedRole === 'dispatch' ? 'var(--capsule-pill-active)' : 'var(--bg-inset)'}; cursor: pointer;">
                DISPATCHER
              </button>
              <button class="capsule-nav-link ${this.selectedRole === 'qa' ? 'is-active' : ''}" data-role="qa" style="flex: 1; text-align: center; padding: 0.5rem; border: 1px solid ${this.selectedRole === 'qa' ? 'var(--accent-amber)' : 'var(--line-structure)'}; background: ${this.selectedRole === 'qa' ? 'var(--capsule-pill-active)' : 'var(--bg-inset)'}; cursor: pointer;">
                SIMULATION
              </button>
            </div>

            <!-- Profile Overview Banner -->
            <div style="background: var(--bg-inset); border: 1px solid var(--line-structure); border-left: 3px solid ${current.color}; padding: 1rem; border-radius: var(--radius-xs); margin-bottom: 1.5rem;">
              <div class="survey-label" style="color: ${current.color}; margin-bottom: 0.25rem;">${current.badge}</div>
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary); margin-bottom: 0.25rem; text-transform: uppercase;">${current.title}</h3>
              <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary); margin: 0;">${current.desc}</p>
            </div>

            <!-- Authentication Form -->
            <form id="portal-auth-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <label class="survey-label" style="display: block; margin-bottom: 0.4rem;">HARDWARE UNIT / DISPATCH NODE ID</label>
                <input type="text" value="${current.unitDefault}" readonly style="width: 100%; background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 0.75rem 1rem; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs); cursor: not-allowed;" />
              </div>

              <div>
                <label class="survey-label" style="display: block; margin-bottom: 0.4rem;">ASSIGNED PIT SECTOR</label>
                <input type="text" value="${current.zoneDefault}" readonly style="width: 100%; background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 0.75rem 1rem; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs); cursor: not-allowed;" />
              </div>

              <div>
                <label class="survey-label" style="display: block; margin-bottom: 0.4rem;">OPERATOR TOKEN PIN / RFID TAG</label>
                <input type="password" value="882049" required style="width: 100%; background: var(--bg-inset); border: 1px solid var(--line-structure); padding: 0.75rem 1rem; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.88rem; border-radius: var(--radius-xs); letter-spacing: 0.2em;" />
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.25rem;">
                <span class="small-mono" style="color: var(--text-muted);">CRYPTO CHIP: ATECC608A VERIFIED</span>
                <span class="small-mono" style="color: var(--state-normal);">KEY VALID</span>
              </div>

              <button type="submit" class="btn-action-primary" style="width: 100%; justify-content: center; padding: 0.85rem; margin-top: 0.5rem;">
                AUTHENTICATE &amp; ENTER ${this.selectedRole.toUpperCase()} CONSOLE
              </button>
            </form>

            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--line-structure); display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
              <a href="/" data-link style="color: var(--text-secondary); text-decoration: none;">← Return to Overview</a>
              <span>FOSAFE PROTOCOL v1.0.4</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
