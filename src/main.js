/**
 * FOSAFE Platform Main Entrypoint
 * Orchestrates styling, global layout shells, router, and page lifecycles.
 */

import './styles/tokens.css';
import './styles/typography.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/visualizations.css';

import { Router } from './lib/router.js';
import { Navigation } from './components/Navigation.js';
import { Footer } from './components/Footer.js';

import { HomePage } from './pages/HomePage.js';
import { TechnologyPage } from './pages/TechnologyPage.js';
import { HowItWorksPage } from './pages/HowItWorksPage.js';
import { PlatformPage } from './pages/PlatformPage.js';
import { CollaborationPage } from './pages/CollaborationPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { LoginPage } from './pages/LoginPage.js';

class App {
  constructor() {
    this.appElement = document.getElementById('app');
    this.currentPageInstance = null;
    this.navInstance = null;
    this.router = null;

    this.initShell();
    this.initRouter();
  }

  initShell() {
    this.appElement.innerHTML = `
      <header id="site-header" class="site-header"></header>
      <main id="page-content" role="main"></main>
      <footer id="site-footer" class="site-footer"></footer>
    `;

    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');

    this.navInstance = new Navigation(headerEl, '/');
    new Footer(footerEl);
  }

  initRouter() {
    const contentEl = document.getElementById('page-content');

    const routes = {
      '/': {
        title: 'FOSAFE | Fog-Aware Safety & Fleet Monitoring System',
        create: () => new HomePage(contentEl)
      },
      '/technology': {
        title: 'FOSAFE Technology | Vehicle Unit & Sensor Bus Specs',
        create: () => new TechnologyPage(contentEl)
      },
      '/how-it-works': {
        title: 'FOSAFE How It Works | Stopping Dynamics & Risk Matrix',
        create: () => new HowItWorksPage(contentEl)
      },
      '/platform': {
        title: 'FOSAFE Platform | Driver Console, Control Room, Simulator',
        create: () => new PlatformPage(contentEl)
      },
      '/collaboration': {
        title: 'FOSAFE Collaboration | Operator Trials & FMS Integration',
        create: () => new CollaborationPage(contentEl)
      },
      '/about': {
        title: 'FOSAFE About | Open-Cast Pit Realities & Engineering Ethos',
        create: () => new AboutPage(contentEl)
      },
      '/login': {
        title: 'FOSAFE Portal | Unified Industrial Access Terminal',
        create: () => new LoginPage(contentEl, this.router)
      }
    };

    this.router = new Router(routes, (path, routeConfig) => {
      // Update browser title
      document.title = routeConfig.title || 'FOSAFE';

      // Update nav link highlights
      if (this.navInstance) {
        this.navInstance.setRoute(path);
      }

      // Unmount previous page
      if (this.currentPageInstance && typeof this.currentPageInstance.unmount === 'function') {
        this.currentPageInstance.unmount();
      }

      // Clear container and mount new page
      contentEl.innerHTML = '';
      this.currentPageInstance = routeConfig.create();
      if (this.currentPageInstance && typeof this.currentPageInstance.mount === 'function') {
        this.currentPageInstance.mount();
      }
    });

    this.router.init();
  }
}

// Bootstrap once DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
