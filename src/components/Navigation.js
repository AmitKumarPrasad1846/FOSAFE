/**
 * FOSAFE v2 Modern Instrument Navigation
 * Top-left minimal wordmark & live status tick.
 * Top-right tactile "ACCESS PLATFORM" & full-screen index overlay trigger.
 * Right-edge vertical scroll-progress rail with stations 01–10.
 * Bottom-anchored mobile thumb bar.
 * Full keyboard accessibility, focus trap, and Escape handling.
 */

import { scrollManager } from '../lib/scroll.js';

export class Navigation {
  constructor(containerElement, currentRoute = '/') {
    this.container = containerElement;
    this.currentRoute = currentRoute;
    this.isOverlayOpen = false;
    this.lastScrollY = 0;
    this.activeStation = 1;
    this.previouslyFocusedElement = null;

    this.stations = [
      { id: 'station-01', num: '01', title: 'RADAR // CLEAR', label: 'THE PIT' },
      { id: 'station-02', num: '02', title: 'FOG COLLAPSE', label: 'HAZARD' },
      { id: 'station-03', num: '03', title: '4-TIER MODEL', label: 'APPROACH' },
      { id: 'station-04', num: '04', title: 'VEHICLE OBU', label: 'HARDWARE' },
      { id: 'station-05', num: '05', title: 'FOG INTEL', label: 'ADAPTIVE' },
      { id: 'station-06', num: '06', title: 'DRIVER HUD', label: 'COCKPIT' },
      { id: 'station-07', num: '07', title: 'MINE CONTROL', label: 'DISPATCH' },
      { id: 'station-08', num: '08', title: 'SAFETY LOGIC', label: 'ARBITRATION' },
      { id: 'station-09', num: '09', title: 'HARDWARE LOOP', label: 'PHYSICAL' },
      { id: 'station-10', num: '10', title: 'FIELD TRIALS', label: 'COLLAB' }
    ];

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.initScrollSpy();
  }

  setRoute(route) {
    this.currentRoute = route;
    this.closeOverlay();
    this.render();
    this.bindEvents();
  }

  openOverlay() {
    this.isOverlayOpen = true;
    this.previouslyFocusedElement = document.activeElement;
    const overlay = document.getElementById('inst-index-overlay');
    const trigger = document.getElementById('inst-menu-trigger');

    if (overlay && trigger) {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-locked');

      // Focus first interactive link
      const firstLink = overlay.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }

  closeOverlay() {
    this.isOverlayOpen = false;
    const overlay = document.getElementById('inst-index-overlay');
    const trigger = document.getElementById('inst-menu-trigger');

    if (overlay && trigger) {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-locked');

      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
      }
    }
  }

  initScrollSpy() {
    // Only spy on home page where stations exist
    if (this.currentRoute !== '/') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stationId = entry.target.id;
          const found = this.stations.find(s => s.id === stationId);
          if (found) {
            this.updateActiveStation(parseInt(found.num, 10));
          }
        }
      });
    }, {
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    });

    this.stations.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    // Scroll direction tracking for minimal header hide/reveal
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const navHeader = document.querySelector('.inst-nav-header');
      if (!navHeader) return;

      if (currentY > 80 && currentY > this.lastScrollY) {
        navHeader.classList.add('is-hidden');
      } else {
        navHeader.classList.remove('is-hidden');
      }
      this.lastScrollY = currentY;
    }, { passive: true });
  }

  updateActiveStation(num) {
    this.activeStation = num;
    const railMarkers = document.querySelectorAll('.rail-marker');
    railMarkers.forEach(m => {
      const markerNum = parseInt(m.getAttribute('data-station-num'), 10);
      if (markerNum === num) {
        m.classList.add('is-active');
        m.setAttribute('aria-current', 'step');
      } else {
        m.classList.remove('is-active');
        m.removeAttribute('aria-current');
      }
    });

    const mobileIndicator = document.querySelector('.mobile-station-current');
    if (mobileIndicator) {
      mobileIndicator.textContent = String(num).padStart(2, '0');
    }
  }

  bindEvents() {
    const trigger = document.getElementById('inst-menu-trigger');
    const closeBtn = document.getElementById('inst-overlay-close');
    const overlay = document.getElementById('inst-index-overlay');

    if (trigger) {
      trigger.addEventListener('click', () => {
        if (this.isOverlayOpen) this.closeOverlay();
        else this.openOverlay();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeOverlay());
    }

    // Escape key closes overlay
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOverlayOpen) {
        this.closeOverlay();
      }
    });

    // Handle clicks inside overlay
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target.matches('a[data-link]') || e.target.closest('a[data-link]')) {
          this.closeOverlay();
        }
      });

      // Trap focus in overlay
      overlay.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !this.isOverlayOpen) return;
        const focusables = overlay.querySelectorAll('a, button, [tabindex="0"]');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      });
    }

    // Click rail markers to smooth scroll
    document.querySelectorAll('.rail-marker').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target-id');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          scrollManager.scrollTo(targetEl, { offset: -30 });
        }
      });
    });
  }

  render() {
    const isHome = this.currentRoute === '/';

    this.container.innerHTML = `
      <!-- Top Fixed Instrument Bar -->
      <header class="inst-nav-header" role="banner">
        <div class="inst-nav-left">
          <a href="/" data-link class="inst-brand" aria-label="FOSAFE System Home">
            <span class="inst-wordmark">FOSAFE</span>
            <span class="inst-status-tick" title="Telemetry Uplink Active">
              <span class="live-dot"></span>
              <span class="tick-label">LIVE HARDWARE // 04 OBU</span>
            </span>
          </a>
        </div>

        <div class="inst-nav-right">
          <a href="/login" data-link class="btn-instrument" aria-label="Access Unified Platform">
            <span class="btn-instrument-icon">⬡</span>
            <span class="btn-instrument-text">ACCESS PLATFORM</span>
          </a>

          <button id="inst-menu-trigger" class="inst-menu-btn" aria-label="Open Navigation Index" aria-expanded="false" aria-haspopup="dialog">
            <span class="menu-btn-label font-mono">INDEX</span>
            <span class="menu-btn-icon" aria-hidden="true">
              <span class="menu-line"></span>
              <span class="menu-line"></span>
            </span>
          </button>
        </div>
      </header>

      <!-- Right Edge Vertical Scroll Progress Rail (Home Page Only) -->
      ${isHome ? `
        <nav class="inst-progress-rail" aria-label="Haul Road Station Progression">
          <div class="rail-spine"></div>
          <div class="rail-markers-list">
            ${this.stations.map((s, idx) => `
              <button 
                class="rail-marker ${idx === 0 ? 'is-active' : ''}" 
                data-station-num="${s.num}" 
                data-target-id="${s.id}"
                aria-label="Jump to Station ${s.num}: ${s.title}"
              >
                <span class="rail-pip"></span>
                <span class="rail-label font-mono">${s.num} · ${s.title}</span>
              </button>
            `).join('')}
          </div>
        </nav>
      ` : ''}

      <!-- Bottom Anchored Mobile Thumb Bar -->
      <div class="inst-mobile-bar" aria-hidden="true">
        <div class="mobile-station-badge font-mono">
          <span class="mobile-station-current">01</span><span class="mobile-station-total">/10</span>
        </div>
        <a href="/platform" data-link class="mobile-platform-btn font-mono">
          <span>PLATFORM</span>
        </a>
      </div>

      <!-- Full-Screen Index Overlay -->
      <div id="inst-index-overlay" class="inst-index-overlay" role="dialog" aria-modal="true" aria-label="System Navigation Index" aria-hidden="true">
        <div class="overlay-backdrop"></div>
        <div class="overlay-container">
          <div class="overlay-header">
            <div class="overlay-header-tag font-mono">
              <span>INDEX // SYSTEM NAVIGATION</span>
              <span style="color: var(--accent-amber);">ESTABLISHED 2026</span>
            </div>
            <button id="inst-overlay-close" class="overlay-close-btn" aria-label="Close Navigation Index">
              <span class="font-mono">CLOSE [ESC]</span>
              <span class="close-x">✕</span>
            </button>
          </div>

          <nav class="overlay-nav-links" aria-label="Site Navigation">
            <a href="/technology" data-link class="overlay-nav-item ${this.currentRoute === '/technology' ? 'is-active' : ''}">
              <span class="item-num font-mono">01</span>
              <span class="item-title">TECHNOLOGY</span>
              <span class="item-desc font-mono">DUAL-CORE ESP32 &amp; SENSOR BUS TOPOLOGY</span>
            </a>

            <a href="/how-it-works" data-link class="overlay-nav-item ${this.currentRoute === '/how-it-works' ? 'is-active' : ''}">
              <span class="item-num font-mono">02</span>
              <span class="item-title">HOW IT WORKS</span>
              <span class="item-desc font-mono">STOPPING DYNAMICS &amp; INTERACTIVE PHYSICS</span>
            </a>

            <a href="/platform" data-link class="overlay-nav-item ${this.currentRoute === '/platform' ? 'is-active' : ''}">
              <span class="item-num font-mono">03</span>
              <span class="item-title">PLATFORM</span>
              <span class="item-desc font-mono">DRIVER CONSOLE, PIT CONTROL &amp; SIMULATOR</span>
            </a>

            <a href="/collaboration" data-link class="overlay-nav-item ${this.currentRoute === '/collaboration' ? 'is-active' : ''}">
              <span class="item-num font-mono">04</span>
              <span class="item-title">COLLABORATION</span>
              <span class="item-desc font-mono">FIELD TRIALS &amp; OPERATOR RETROFITS</span>
            </a>

            <a href="/about" data-link class="overlay-nav-item ${this.currentRoute === '/about' ? 'is-active' : ''}">
              <span class="item-num font-mono">05</span>
              <span class="item-title">ABOUT</span>
              <span class="item-desc font-mono">OPEN-CAST HAZARD CONTEXT &amp; STANDARDS</span>
            </a>

            <a href="/login" data-link class="overlay-nav-item login-item">
              <span class="item-num font-mono">06</span>
              <span class="item-title">ACCESS PLATFORM</span>
              <span class="item-desc font-mono">DRIVER / DISPATCHER / QA AUTHENTICATION →</span>
            </a>
          </nav>

          <div class="overlay-footer font-mono">
            <div>DGMS COMPLIANT PROXIMITY SYSTEM // ISO 21815-2</div>
            <div>STATUS: TELEMETRY NODES SYNCHRONIZED</div>
          </div>
        </div>
      </div>
    `;
  }
}
