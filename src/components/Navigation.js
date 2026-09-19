/**
 * FOSAFE v2 Floating Right-Side Capsule Navigation
 * Sleek floating pill / capsule docked on the top-right (desktop)
 * and thumb-reachable floating bottom capsule (mobile).
 * Integrates:
 * - Minimal wordmark + live status tick
 * - Index overlay trigger with full keyboard support & focus trap
 * - Light / Dark mode toggle switch
 * - Tactile "ACCESS PLATFORM" button
 * - Right-edge vertical scroll progress rail (stations 01-10)
 */

import { scrollManager } from '../lib/scroll.js';
import { themeManager } from '../lib/theme.js';

export class Navigation {
  constructor(containerElement, currentRoute = '/') {
    this.container = containerElement;
    this.currentRoute = currentRoute;
    this.isOverlayOpen = false;
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
    this.syncThemeIcon();

    // Subscribe to external theme changes
    themeManager.subscribe(() => {
      this.syncThemeIcon();
    });
  }

  setRoute(route) {
    this.currentRoute = route;
    this.closeOverlay();
    this.render();
    this.bindEvents();
    this.syncThemeIcon();
  }

  syncThemeIcon() {
    const isDark = themeManager.getTheme() === 'dark';
    const icons = this.container.querySelectorAll('.theme-toggle-icon');
    icons.forEach(icon => {
      icon.textContent = isDark ? '☀️' : '🌙';
      icon.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  openOverlay() {
    this.isOverlayOpen = true;
    this.previouslyFocusedElement = document.activeElement;
    const overlay = document.getElementById('inst-index-overlay');
    const trigger = document.getElementById('capsule-menu-trigger');

    if (overlay && trigger) {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-locked');

      const firstLink = overlay.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }

  closeOverlay() {
    this.isOverlayOpen = false;
    const overlay = document.getElementById('inst-index-overlay');
    const trigger = document.getElementById('capsule-menu-trigger');

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

    const mobileStation = document.querySelector('.capsule-mobile-station');
    if (mobileStation) {
      mobileStation.textContent = `${String(num).padStart(2, '0')}/10`;
    }
  }

  bindEvents() {
    const trigger = document.getElementById('capsule-menu-trigger');
    const mobileTrigger = document.getElementById('capsule-mobile-trigger');
    const closeBtn = document.getElementById('inst-overlay-close');
    const overlay = document.getElementById('inst-index-overlay');

    if (trigger) {
      trigger.addEventListener('click', () => {
        if (this.isOverlayOpen) this.closeOverlay();
        else this.openOverlay();
      });
    }

    if (mobileTrigger) {
      mobileTrigger.addEventListener('click', () => {
        if (this.isOverlayOpen) this.closeOverlay();
        else this.openOverlay();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeOverlay());
    }

    // Theme toggles
    this.container.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        themeManager.toggle();
        this.syncThemeIcon();
      });
    });

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
      <!-- FLOATING RIGHT-SIDE CAPSULE NAVBAR (DESKTOP) -->
      <nav class="nav-capsule-desktop" role="navigation" aria-label="Main Capsule Navigation">
        <!-- Capsule Brand & Live Beacon -->
        <a href="/" data-link class="capsule-brand-link" aria-label="FOSAFE Home">
          <span class="capsule-brand-text">FOSAFE</span>
          <span class="capsule-status-dot" title="Live OBU Telemetry Active"></span>
        </a>

        <span class="capsule-sep" aria-hidden="true"></span>

        <!-- Quick Nav Route Pills -->
        <div class="capsule-links-group">
          <a href="/technology" data-link class="capsule-nav-link ${this.currentRoute === '/technology' ? 'is-active' : ''}">TECH</a>
          <a href="/how-it-works" data-link class="capsule-nav-link ${this.currentRoute === '/how-it-works' ? 'is-active' : ''}">PHYSICS</a>
          <a href="/platform" data-link class="capsule-nav-link ${this.currentRoute === '/platform' ? 'is-active' : ''}">PLATFORM</a>
          <a href="/about" data-link class="capsule-nav-link ${this.currentRoute === '/about' ? 'is-active' : ''}">ABOUT</a>
        </div>

        <span class="capsule-sep" aria-hidden="true"></span>

        <!-- Menu / Index Overlay Trigger -->
        <button id="capsule-menu-trigger" class="capsule-btn-icon" aria-label="Open System Index" aria-expanded="false" aria-haspopup="dialog">
          <span class="capsule-btn-label font-mono">INDEX</span>
          <span class="capsule-burger-lines" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
        </button>

        <span class="capsule-sep" aria-hidden="true"></span>

        <!-- Dark / Light Theme Toggle -->
        <button class="capsule-btn-icon theme-toggle-btn" aria-label="Toggle Light / Dark Mode" title="Toggle Light/Dark Theme">
          <span class="theme-toggle-icon">☀️</span>
        </button>

        <span class="capsule-sep" aria-hidden="true"></span>

        <!-- Access Platform Action -->
        <a href="/login" data-link class="capsule-cta-btn" aria-label="Access Unified Platform">
          <span>ACCESS</span>
          <span class="cta-arrow">→</span>
        </a>
      </nav>

      <!-- FLOATING BOTTOM CAPSULE NAVBAR (MOBILE / TABLET) -->
      <div class="nav-capsule-mobile" role="navigation" aria-label="Mobile Navigation Bar">
        <a href="/" data-link class="mobile-capsule-brand">
          <span class="capsule-brand-text" style="font-size: 1.1rem;">FOSAFE</span>
          <span class="capsule-status-dot"></span>
        </a>

        ${isHome ? `
          <span class="capsule-mobile-station font-mono">01/10</span>
        ` : ''}

        <button class="mobile-capsule-btn theme-toggle-btn" aria-label="Toggle Light / Dark Mode">
          <span class="theme-toggle-icon">☀️</span>
        </button>

        <button id="capsule-mobile-trigger" class="mobile-capsule-btn" aria-label="Open Menu Index">
          <span class="font-mono" style="font-size: 0.72rem; font-weight: 700;">MENU</span>
        </button>

        <a href="/platform" data-link class="mobile-capsule-cta font-mono">
          <span>PLATFORM</span>
        </a>
      </div>

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
            <a href="/" data-link class="overlay-nav-item ${this.currentRoute === '/' ? 'is-active' : ''}">
              <span class="item-num font-mono">00</span>
              <span class="item-title">HAUL ROAD RADAR</span>
              <span class="item-desc font-mono">CONTINUOUS 10-STATION SCENARIO JOURNEY</span>
            </a>

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
              <span class="item-desc font-mono">OPERATOR / DISPATCH / QA AUTHENTICATION →</span>
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
