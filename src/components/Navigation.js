/**
 * FOSAFE v2 Floating Right-Side Capsule Navigation
 * Ultra-compact floating pill docked on top-right (desktop)
 * and thumb-reachable floating bottom capsule (mobile).
 * Direct, sleek, and uncluttered with bilingual EN/हिन्दी toggle.
 */

import { scrollManager } from '../lib/scroll.js';
import { themeManager } from '../lib/theme.js';
import { i18n } from '../lib/i18n.js';

export class Navigation {
  constructor(containerElement, currentRoute = '/') {
    this.container = containerElement;
    this.currentRoute = currentRoute;
    this.activeStation = 1;

    this.stationKeys = [
      { id: 'station-01', num: '01', key: 'rail.s01' },
      { id: 'station-02', num: '02', key: 'rail.s02' },
      { id: 'station-03', num: '03', key: 'rail.s03' },
      { id: 'station-04', num: '04', key: 'rail.s04' },
      { id: 'station-05', num: '05', key: 'rail.s05' },
      { id: 'station-06', num: '06', key: 'rail.s06' },
      { id: 'station-07', num: '07', key: 'rail.s07' },
      { id: 'station-08', num: '08', key: 'rail.s08' },
      { id: 'station-09', num: '09', key: 'rail.s09' },
      { id: 'station-10', num: '10', key: 'rail.s10' }
    ];

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.initScrollSpy();
    this.syncThemeIcon();

    themeManager.subscribe(() => {
      this.syncThemeIcon();
    });

    i18n.subscribe(() => {
      this.render();
      this.bindEvents();
      this.syncThemeIcon();
      this.updateActiveStation(this.activeStation);
    });
  }

  setRoute(route) {
    this.currentRoute = route;
    this.render();
    this.bindEvents();
    this.syncThemeIcon();
    this.initScrollSpy();
  }

  syncThemeIcon() {
    const isDark = themeManager.getTheme() === 'dark';
    const icons = this.container.querySelectorAll('.theme-toggle-icon');
    icons.forEach(icon => {
      icon.textContent = isDark ? '☀️' : '🌙';
      icon.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  initScrollSpy() {
    if (this.currentRoute !== '/') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stationId = entry.target.id;
          const found = this.stationKeys.find(s => s.id === stationId);
          if (found) {
            this.updateActiveStation(parseInt(found.num, 10));
          }
        }
      });
    }, {
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    });

    this.stationKeys.forEach(s => {
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
    // Theme toggles
    this.container.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        themeManager.toggle();
        this.syncThemeIcon();
      });
    });

    // Language toggle
    this.container.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        i18n.toggle();
      });
    });

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
    const lang = i18n.getLang();

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
          <a href="/technology" data-link class="capsule-nav-link ${this.currentRoute === '/technology' ? 'is-active' : ''}">${i18n.t('nav.tech')}</a>
          <a href="/how-it-works" data-link class="capsule-nav-link ${this.currentRoute === '/how-it-works' ? 'is-active' : ''}">${i18n.t('nav.physics')}</a>
          <a href="/platform" data-link class="capsule-nav-link ${this.currentRoute === '/platform' ? 'is-active' : ''}">${i18n.t('nav.platform')}</a>
          <a href="/about" data-link class="capsule-nav-link ${this.currentRoute === '/about' ? 'is-active' : ''}">${i18n.t('nav.about')}</a>
        </div>

        <span class="capsule-sep" aria-hidden="true"></span>

        <!-- Language Switcher Pill (EN / हिन्दी) -->
        <button class="capsule-lang-btn lang-toggle-btn" aria-label="Switch between English and Hindi" title="Change Language / भाषा बदलें">
          <span class="lang-opt ${lang === 'en' ? 'is-active' : ''}">EN</span>
          <span class="lang-slash">/</span>
          <span class="lang-opt ${lang === 'hi' ? 'is-active' : ''}">हिन्दी</span>
        </button>

        <!-- Dark / Light Theme Toggle -->
        <button class="capsule-btn-icon theme-toggle-btn" aria-label="Toggle Light / Dark Mode" title="Toggle Light/Dark Theme">
          <span class="theme-toggle-icon">☀️</span>
        </button>

        <span class="capsule-sep" aria-hidden="true"></span>

        <!-- Access Platform Action -->
        <a href="/login" data-link class="capsule-cta-btn" aria-label="Access Unified Platform">
          <span>${i18n.t('nav.access')}</span>
          <span class="cta-arrow">→</span>
        </a>
      </nav>

      <!-- FLOATING BOTTOM CAPSULE NAVBAR (MOBILE / TABLET) -->
      <div class="nav-capsule-mobile" role="navigation" aria-label="Mobile Navigation Bar">
        <a href="/" data-link class="mobile-capsule-brand">
          <span class="capsule-brand-text" style="font-size: 1.05rem;">FOSAFE</span>
          <span class="capsule-status-dot"></span>
        </a>

        <div style="display: flex; align-items: center; gap: 0.2rem;">
          <a href="/technology" data-link class="capsule-nav-link ${this.currentRoute === '/technology' ? 'is-active' : ''}" style="font-size: 0.65rem; padding: 0.25rem 0.45rem;">${i18n.t('nav.tech')}</a>
          <a href="/platform" data-link class="capsule-nav-link ${this.currentRoute === '/platform' ? 'is-active' : ''}" style="font-size: 0.65rem; padding: 0.25rem 0.45rem;">${i18n.t('nav.platform')}</a>
        </div>

        <!-- Mobile Language Toggle -->
        <button class="capsule-lang-btn lang-toggle-btn" style="padding: 0.25rem 0.5rem; font-size: 0.65rem;" title="Change Language">
          <span class="lang-opt ${lang === 'en' ? 'is-active' : ''}">EN</span>
          <span class="lang-slash">/</span>
          <span class="lang-opt ${lang === 'hi' ? 'is-active' : ''}">हिं</span>
        </button>

        <button class="mobile-capsule-btn theme-toggle-btn" aria-label="Toggle Light / Dark Mode" style="padding: 0.25rem 0.5rem;">
          <span class="theme-toggle-icon">☀️</span>
        </button>

        <a href="/login" data-link class="mobile-capsule-cta font-mono" style="padding: 0.3rem 0.75rem; font-size: 0.72rem;">
          <span>${i18n.t('nav.login')}</span>
        </a>
      </div>

      <!-- Right Edge Vertical Scroll Progress Rail (Home Page Only) -->
      ${isHome ? `
        <nav class="inst-progress-rail" aria-label="Haul Road Station Progression">
          <div class="rail-spine"></div>
          <div class="rail-markers-list">
            ${this.stationKeys.map((s, idx) => `
              <button 
                class="rail-marker ${idx === 0 ? 'is-active' : ''}" 
                data-station-num="${s.num}" 
                data-target-id="${s.id}"
                aria-label="Jump to Station ${s.num}"
              >
                <span class="rail-pip"></span>
                <span class="rail-label font-mono">${i18n.t(s.key)}</span>
              </button>
            `).join('')}
          </div>
        </nav>
      ` : ''}
    `;
  }
}
