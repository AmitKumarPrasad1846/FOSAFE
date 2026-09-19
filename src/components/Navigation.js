/**
 * FOSAFE Refined Navigation Component
 * Compact, engineering-grade industrial navigation with live status beacon.
 */

export class Navigation {
  constructor(headerElement, currentRoute = '/') {
    this.header = headerElement;
    this.currentRoute = currentRoute;
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.handleScroll();
  }

  setRoute(route) {
    this.currentRoute = route;
    this.updateActiveLinks();
    this.closeMobileMenu();
  }

  updateActiveLinks() {
    this.header.querySelectorAll('[data-route]').forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === this.currentRoute) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    const toggle = this.header.querySelector('.mobile-menu-toggle');
    const drawer = this.header.querySelector('.mobile-drawer');
    if (toggle) toggle.classList.remove('is-active');
    if (drawer) drawer.classList.remove('is-open');
  }

  handleScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        this.header.classList.add('is-scrolled');
      } else {
        this.header.classList.remove('is-scrolled');
      }
    });
  }

  bindEvents() {
    const toggle = this.header.querySelector('.mobile-menu-toggle');
    const drawer = this.header.querySelector('.mobile-drawer');

    if (toggle && drawer) {
      toggle.addEventListener('click', () => {
        this.isMenuOpen = !this.isMenuOpen;
        toggle.classList.toggle('is-active', this.isMenuOpen);
        drawer.classList.toggle('is-open', this.isMenuOpen);
      });
    }
  }

  render() {
    this.header.innerHTML = `
      <div class="container">
        <div class="nav-inner">
          <!-- Brand Logo & Heartbeat -->
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <a href="/" data-link class="brand-group" aria-label="FOSAFE Home">
              <div class="brand-logo-mark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div class="brand-text">
                <span class="brand-title">FOSAFE</span>
                <span class="brand-subtitle">MINE FLEET SAFETY</span>
              </div>
            </a>

            <!-- Operational Status Indicator -->
            <div class="nav-heartbeat" title="Real-time telemetry uplink active">
              <span class="pulse-dot"></span>
              <span>4 NODES ONLINE</span>
            </div>
          </div>

          <!-- Desktop Navigation Menu -->
          <nav class="nav-menu" aria-label="Main Navigation">
            <a href="/technology" data-link data-route="/technology" class="nav-link ${this.currentRoute === '/technology' ? 'is-active' : ''}">Technology</a>
            <a href="/how-it-works" data-link data-route="/how-it-works" class="nav-link ${this.currentRoute === '/how-it-works' ? 'is-active' : ''}">How It Works</a>
            <a href="/platform" data-link data-route="/platform" class="nav-link ${this.currentRoute === '/platform' ? 'is-active' : ''}">Platform</a>
            <a href="/collaboration" data-link data-route="/collaboration" class="nav-link ${this.currentRoute === '/collaboration' ? 'is-active' : ''}">Collaboration</a>
            <a href="/about" data-link data-route="/about" class="nav-link ${this.currentRoute === '/about' ? 'is-active' : ''}">About</a>
          </nav>

          <!-- Primary Actions -->
          <div class="nav-actions">
            <a href="/login" data-link data-route="/login" class="btn btn-primary btn-sm" id="nav-access-btn">
              <span>ACCESS PLATFORM</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <!-- Mobile Drawer Button -->
            <button class="mobile-menu-toggle" aria-label="Toggle Navigation Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Menu Drawer -->
      <div class="mobile-drawer">
        <a href="/technology" data-link data-route="/technology" class="mobile-nav-link ${this.currentRoute === '/technology' ? 'is-active' : ''}">
          <span>Technology</span>
          <span style="color: var(--text-dim);">01</span>
        </a>
        <a href="/how-it-works" data-link data-route="/how-it-works" class="mobile-nav-link ${this.currentRoute === '/how-it-works' ? 'is-active' : ''}">
          <span>How It Works</span>
          <span style="color: var(--text-dim);">02</span>
        </a>
        <a href="/platform" data-link data-route="/platform" class="mobile-nav-link ${this.currentRoute === '/platform' ? 'is-active' : ''}">
          <span>Platform</span>
          <span style="color: var(--text-dim);">03</span>
        </a>
        <a href="/collaboration" data-link data-route="/collaboration" class="mobile-nav-link ${this.currentRoute === '/collaboration' ? 'is-active' : ''}">
          <span>Collaboration</span>
          <span style="color: var(--text-dim);">04</span>
        </a>
        <a href="/about" data-link data-route="/about" class="mobile-nav-link ${this.currentRoute === '/about' ? 'is-active' : ''}">
          <span>About</span>
          <span style="color: var(--text-dim);">05</span>
        </a>
        <a href="/login" data-link data-route="/login" class="mobile-nav-link" style="color: var(--accent-amber); font-weight: 700; margin-top: 0.5rem;">
          <span>Access Unified Platform →</span>
        </a>
      </div>
    `;
  }
}
