/**
 * FOSAFE Theme Manager
 * Supports Dark Mode (Industrial Graphite) & Light Mode (Technical Blueprint Drafting Paper).
 * Persists in localStorage and synchronizes with system preference and canvas scenes.
 */

class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'fosafe_theme';
    this.currentTheme = this.getInitialTheme();
    this.listeners = new Set();
    this.applyTheme(this.currentTheme, false);
  }

  getInitialTheme() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Default to dark mode for mining instrument aesthetic
    return 'dark';
  }

  applyTheme(theme, notify = true) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    if (notify) {
      window.dispatchEvent(new CustomEvent('fosafe:theme-change', { detail: { theme } }));
      this.listeners.forEach(cb => cb(theme));
    }
  }

  toggle() {
    const next = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(next, true);
    return next;
  }

  getTheme() {
    return this.currentTheme;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

export const themeManager = new ThemeManager();
