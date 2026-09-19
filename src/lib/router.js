/**
 * FOSAFE Client-Side Router
 * Lightweight, robust routing with hash and path synchronization.
 */

export class Router {
  constructor(routes, onRouteRender) {
    this.routes = routes;
    this.onRouteRender = onRouteRender;
    this.currentRoute = '/';

    window.addEventListener('popstate', () => this.handleLocationChange());
    window.addEventListener('hashchange', () => this.handleLocationChange());

    // Intercept clicks on links with data-link attribute
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      }
    });
  }

  isStaticHost() {
    return window.location.hostname.endsWith('github.io') || 
           window.location.protocol === 'file:' || 
           window.location.pathname.toLowerCase().includes('/fosafe');
  }

  getCurrentPath() {
    // If hash is present (e.g. #/technology)
    if (window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }
    if (window.location.hash.startsWith('#')) {
      const h = window.location.hash.slice(1);
      return h.startsWith('/') ? h : '/' + h;
    }

    // If on GitHub Pages with subpath without hash, redirect to hash route
    if (this.isStaticHost() && !window.location.hash) {
      return '/';
    }

    const path = window.location.pathname;
    return path === '' ? '/' : path;
  }

  handleLocationChange() {
    let path = this.getCurrentPath();
    // Normalize trailing slash if not root
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    if (!this.routes[path]) {
      path = '/';
    }

    this.currentRoute = path;
    window.scrollTo(0, 0);

    if (this.onRouteRender) {
      this.onRouteRender(path, this.routes[path]);
    }
  }

  navigate(path) {
    if (this.isStaticHost() || window.location.hash.startsWith('#')) {
      window.location.hash = '#' + path;
    } else {
      window.history.pushState({}, '', path);
      this.handleLocationChange();
    }
  }

  init() {
    // If static host and no hash, initialize hash
    if (this.isStaticHost() && !window.location.hash) {
      window.location.hash = '#/';
    }
    this.handleLocationChange();
  }
}
