/**
 * FOSAFE v2 Right-Side Vertical Icon Navigation Dock & Left-Side Scroll Rail
 *
 * Architecture:
 * 1. Desktop Right Dock: Sleek vertical capsule docked on right edge with modern
 *    vector icons for all pages (Home, Tech, How It Works, Platform, Collaboration, About, Login).
 *    Hovering over any icon reveals a smooth glassmorphic tooltip pill sliding out to the left.
 *    Includes instant Language (EN/हिन्दी) and Theme (☀️/🌙) toggles.
 * 2. Left-Side 10-Station Story Rail: Placed on the left edge for the Home page.
 *    Tracks real-time scroll position via bounding-rect viewport geometry so the active
 *    amber glowing indicator follows the user smoothly and jumping by clicking works instantly.
 * 3. Mobile Floating Bottom Dock: Thumb-reachable bottom capsule for screens <= 900px.
 */

import { scrollManager } from '../lib/scroll.js';
import { themeManager } from '../lib/theme.js';
import { i18n } from '../lib/i18n.js';

export class Navigation {
  constructor(containerElement, currentRoute = '/') {
    this.container = containerElement;
    this.currentRoute = currentRoute;
    this.activeStation = 1;
    this.scrollListener = null;

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

    this.unsubscribeTheme = themeManager.subscribe(() => {
      this.syncThemeIcon();
    });

    this.unsubscribeLang = i18n.subscribe(() => {
      this.render();
      this.bindEvents();
      this.syncThemeIcon();
      this.initScrollSpy();
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
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }

    if (this.currentRoute !== '/') return;

    let ticking = false;
    this.scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.checkActiveStation();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });

    // Initial check after short mount delay
    setTimeout(() => {
      this.checkActiveStation();
      this.bindRailClicks();
    }, 150);
  }

  checkActiveStation() {
    if (this.currentRoute !== '/') return;

    const threshold = window.innerHeight * 0.40;
    let currentStation = 1;

    for (let i = 0; i < this.stationKeys.length; i++) {
      const s = this.stationKeys[i];
      const el = document.getElementById(s.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentStation = parseInt(s.num, 10);
        }
      }
    }

    if (currentStation !== this.activeStation) {
      this.updateActiveStation(currentStation);
    }
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

    const mobileStation = document.querySelector('.mobile-station-badge');
    if (mobileStation) {
      mobileStation.textContent = `${String(num).padStart(2, '0')}/10`;
    }
  }

  bindRailClicks() {
    document.querySelectorAll('.rail-marker').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target-id');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          scrollManager.scrollTo(targetEl, { offset: -25 });
        }
      };
    });
  }

  bindEvents() {
    // Theme toggles
    this.container.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        themeManager.toggle();
        this.syncThemeIcon();
      };
    });

    // Language toggles
    this.container.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        i18n.toggle();
      };
    });

    // Rail click delegation
    this.bindRailClicks();
  }

  render() {
    const isHome = this.currentRoute === '/';
    const lang = i18n.getLang();

    this.container.innerHTML = `
      <!-- ===================================================================
           1. RIGHT-SIDE VERTICAL ICON DOCK (DESKTOP)
           =================================================================== -->
      <nav class="nav-dock-desktop" role="navigation" aria-label="Main Icon Navigation">
        <!-- Brand Glyph -->
        <a href="/" data-link class="dock-brand-link" aria-label="FOSAFE Home" title="FOSAFE Home">
          <span class="dock-brand-mark">FO</span>
          <span class="dock-status-dot" title="Live LiDAR & Collision Avoidance Active"></span>
        </a>

        <div class="dock-divider" aria-hidden="true"></div>

        <!-- Navigation Icon Buttons with Hover Tooltips sliding to the Left -->
        <div class="dock-items-list">
          <!-- Home -->
          <a href="/" data-link class="dock-btn ${this.currentRoute === '/' ? 'is-active' : ''}" aria-label="${i18n.t('nav.home')}">
            <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z"/>
            </svg>
            <span class="dock-tooltip font-mono">${i18n.t('nav.home')}</span>
          </a>

          <!-- Technology -->
          <a href="/technology" data-link class="dock-btn ${this.currentRoute === '/technology' ? 'is-active' : ''}" aria-label="${i18n.t('nav.tech')}">
            <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="1" x2="9" y2="4"></line>
              <line x1="15" y1="1" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="23"></line>
              <line x1="15" y1="20" x2="15" y2="23"></line>
              <line x1="20" y1="9" x2="23" y2="9"></line>
              <line x1="20" y1="14" x2="23" y2="14"></line>
              <line x1="1" y1="9" x2="4" y2="9"></line>
              <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
            <span class="dock-tooltip font-mono">${i18n.t('nav.tech')}</span>
          </a>

          <!-- How It Works / Physics -->
          <a href="/how-it-works" data-link class="dock-btn ${this.currentRoute === '/how-it-works' ? 'is-active' : ''}" aria-label="${i18n.t('nav.physics')}">
            <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
            <span class="dock-tooltip font-mono">${i18n.t('nav.physics')}</span>
          </a>

          <!-- Platform & Simulator -->
          <a href="/platform" data-link class="dock-btn ${this.currentRoute === '/platform' ? 'is-active' : ''}" aria-label="${i18n.t('nav.platform')}">
            <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span class="dock-tooltip font-mono">${i18n.t('nav.platform')}</span>
          </a>

          <!-- Collaboration & Pilots -->
          <a href="/collaboration" data-link class="dock-btn ${this.currentRoute === '/collaboration' ? 'is-active' : ''}" aria-label="${i18n.t('nav.collab')}">
            <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span class="dock-tooltip font-mono">${i18n.t('nav.collab')}</span>
          </a>

          <!-- About System -->
          <a href="/about" data-link class="dock-btn ${this.currentRoute === '/about' ? 'is-active' : ''}" aria-label="${i18n.t('nav.about')}">
            <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span class="dock-tooltip font-mono">${i18n.t('nav.about')}</span>
          </a>
        </div>

        <div class="dock-divider" aria-hidden="true"></div>

        <!-- Access / Demo Portal CTA -->
        <a href="/login" data-link class="dock-btn dock-btn-cta ${this.currentRoute === '/login' ? 'is-active' : ''}" aria-label="${i18n.t('nav.access')}">
          <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
          </svg>
          <span class="dock-tooltip font-mono">${i18n.t('nav.access')}</span>
        </a>

        <div class="dock-divider" aria-hidden="true"></div>

        <!-- Utility Controls: Language & Dark/Light Theme -->
        <div class="dock-utils-list">
          <button class="dock-btn lang-toggle-btn" aria-label="Toggle English and Hindi" title="Change Language / भाषा">
            <span class="dock-lang-pill font-mono">${lang === 'en' ? 'HI' : 'EN'}</span>
            <span class="dock-tooltip font-mono">${lang === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}</span>
          </button>

          <button class="dock-btn theme-toggle-btn" aria-label="Toggle Light and Dark Mode" title="Theme">
            <span class="theme-toggle-icon">☀️</span>
            <span class="dock-tooltip font-mono">${lang === 'hi' ? 'थीम बदलें' : 'Toggle Theme'}</span>
          </button>
        </div>
      </nav>

      <!-- ===================================================================
           2. LEFT-SIDE 10-STATION STORY RAIL (DESKTOP - HOME ONLY)
           =================================================================== -->
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

      <!-- ===================================================================
           3. MOBILE / TABLET FLOATING BOTTOM CAPSULE DOCK (<= 900PX)
           =================================================================== -->
      <nav class="nav-dock-mobile" role="navigation" aria-label="Mobile Navigation">
        <!-- Home -->
        <a href="/" data-link class="mobile-dock-btn ${this.currentRoute === '/' ? 'is-active' : ''}" title="${i18n.t('nav.home')}">
          <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z"/>
          </svg>
        </a>

        <!-- Tech -->
        <a href="/technology" data-link class="mobile-dock-btn ${this.currentRoute === '/technology' ? 'is-active' : ''}" title="${i18n.t('nav.tech')}">
          <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
          </svg>
        </a>

        <!-- How It Works -->
        <a href="/how-it-works" data-link class="mobile-dock-btn ${this.currentRoute === '/how-it-works' ? 'is-active' : ''}" title="${i18n.t('nav.physics')}">
          <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          </svg>
        </a>

        <!-- Platform -->
        <a href="/platform" data-link class="mobile-dock-btn ${this.currentRoute === '/platform' ? 'is-active' : ''}" title="${i18n.t('nav.platform')}">
          <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
          </svg>
        </a>

        <!-- Terminal Login -->
        <a href="/login" data-link class="mobile-dock-btn mobile-dock-cta ${this.currentRoute === '/login' ? 'is-active' : ''}" title="${i18n.t('nav.access')}">
          <svg class="dock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777z"></path>
          </svg>
        </a>

        <!-- Mobile Lang Toggle -->
        <button class="mobile-dock-btn lang-toggle-btn font-mono" title="Language">
          ${lang === 'en' ? 'HI' : 'EN'}
        </button>

        <!-- Mobile Theme Toggle -->
        <button class="mobile-dock-btn theme-toggle-btn" title="Theme">
          <span class="theme-toggle-icon">☀️</span>
        </button>

        ${isHome ? `<span class="mobile-station-badge font-mono">01/10</span>` : ''}
      </nav>
    `;
  }

  destroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }
    if (this.unsubscribeTheme) this.unsubscribeTheme();
    if (this.unsubscribeLang) this.unsubscribeLang();
  }
}
