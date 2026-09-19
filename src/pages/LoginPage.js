/**
 * FOSAFE LoginPage
 * Industrial Access Terminal for In-Cab Operator, Dispatcher Ops,
 * and Simulation Engineers with instant demonstration mode.
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
        color: '#F59E0B',
        desc: 'Accesses localized in-cab proximity radar, forward obstacle readouts, and Fog Assist beacon controls.'
      },
      dispatch: {
        id: 'dispatch',
        badge: 'DISPATCH OPS // ROLE 02',
        title: 'Mine Fleet Operations Center',
        unitDefault: 'CENTRAL DISPATCH CONSOLE 01',
        zoneDefault: 'ALL PIT SECTORS (01–06)',
        color: '#10B981',
        desc: 'Accesses pit-wide topographical radar, active hazard alerts, and real-time fleet risk indices.'
      },
      qa: {
        id: 'qa',
        badge: 'ENGINEERING // ROLE 03',
        title: 'Simulation & Telematics Sandbox',
        unitDefault: 'OFFLINE QA TESTBENCH',
        zoneDefault: 'SYNTHETIC CONVERGENCE KERNEL',
        color: '#93C5FD',
        desc: 'Executes Monte Carlo traffic runs and stress tests risk arbitration algorithms in synthetic dense fog.'
      }
    };

    const current = roles[this.selectedRole];

    this.container.innerHTML = `
      <div style="padding: var(--space-12) 0 var(--space-20); display: flex; align-items: center; justify-content: center; min-height: 80vh;">
        <div class="container" style="max-width: 580px;">
          <!-- Gateway Box -->
          <div class="tech-panel" style="box-shadow: var(--shadow-heavy);">
            <!-- Gateway Header -->
            <div class="tech-header">
              <span class="tech-title">INDUSTRIAL ACCESS TERMINAL</span>
              <span class="telemetry-tag normal"><span class="pulse-dot"></span>PORTAL SECURED</span>
            </div>

            <!-- Role Selector Tabs -->
            <div style="display: flex; gap: 0.35rem; margin-bottom: 1.5rem;">
              <button class="telemetry-tag sensor-selector-pill ${this.selectedRole === 'operator' ? 'is-active' : ''}" data-role="operator" style="flex: 1; justify-content: center;">
                OPERATOR
              </button>
              <button class="telemetry-tag sensor-selector-pill ${this.selectedRole === 'dispatch' ? 'is-active' : ''}" data-role="dispatch" style="flex: 1; justify-content: center;">
                DISPATCHER
              </button>
              <button class="telemetry-tag sensor-selector-pill ${this.selectedRole === 'qa' ? 'is-active' : ''}" data-role="qa" style="flex: 1; justify-content: center;">
                SIMULATION
              </button>
            </div>

            <!-- Profile Overview Banner -->
            <div style="background: #090B0F; border: 1px solid var(--border-subtle); border-left: 3px solid ${current.color}; padding: 0.85rem; border-radius: var(--radius-xs); margin-bottom: 1.5rem;">
              <div class="data-label" style="color: ${current.color}; margin-bottom: 0.25rem;">${current.badge}</div>
              <h3 style="font-family: var(--font-display); font-size: 1.15rem; color: #EDEFEF; margin-bottom: 0.25rem;">${current.title}</h3>
              <p style="font-size: 0.78rem; line-height: 1.45; color: var(--text-secondary);">${current.desc}</p>
            </div>

            <!-- Authentication Form -->
            <form id="portal-auth-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label class="data-label" style="display: block; margin-bottom: 0.35rem;">HARDWARE UNIT / DISPATCH NODE ID</label>
                <input type="text" value="${current.unitDefault}" readonly style="width: 100%; background: #07090C; border: 1px solid var(--border-subtle); padding: 0.65rem 0.85rem; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.82rem; border-radius: var(--radius-xs); cursor: not-allowed;" />
              </div>

              <div>
                <label class="data-label" style="display: block; margin-bottom: 0.35rem;">ASSIGNED PIT SECTOR</label>
                <input type="text" value="${current.zoneDefault}" readonly style="width: 100%; background: #07090C; border: 1px solid var(--border-subtle); padding: 0.65rem 0.85rem; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.82rem; border-radius: var(--radius-xs); cursor: not-allowed;" />
              </div>

              <div>
                <label class="data-label" style="display: block; margin-bottom: 0.35rem;">OPERATOR TOKEN PIN / RFID TAG</label>
                <input type="password" value="882049" required style="width: 100%; background: #090B0E; border: 1px solid var(--border-medium); padding: 0.65rem 0.85rem; color: #EDEFEF; font-family: var(--font-mono); font-size: 0.85rem; border-radius: var(--radius-xs); letter-spacing: 0.2em;" />
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.25rem;">
                <span class="mono-readout" style="font-size: 0.7rem; color: var(--text-dim);">CRYPTO CHIP: ATECC608A VERIFIED</span>
                <span class="mono-readout" style="font-size: 0.7rem; color: var(--status-normal);">KEY VALID</span>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; margin-top: 0.5rem;">
                AUTHENTICATE &amp; ENTER ${this.selectedRole.toUpperCase()} CONSOLE
              </button>
            </form>

            <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">
              <a href="/" data-link style="color: var(--text-muted);">← Return to Overview</a>
              <span>FOSAFE PROTOCOL v1.0.4</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
