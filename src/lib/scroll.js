/**
 * FOSAFE v2 Scroll & Motion Orchestrator
 * Integrates Lenis smooth scroll with GSAP ScrollTrigger and the unified MasterTicker.
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ticker } from './ticker.js';

gsap.registerPlugin(ScrollTrigger);

class ScrollManager {
  constructor() {
    this.lenis = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    // Respect reduced motion
    const isReduced = ticker.prefersReducedMotion;

    this.lenis = new Lenis({
      duration: isReduced ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !isReduced,
      touchMultiplier: 1.5,
      infinite: false
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    // Wire Lenis to the single shared MasterTicker
    ticker.add('lenis_scroll', (delta, elapsed, currentTime) => {
      if (this.lenis) {
        this.lenis.raf(currentTime);
      }
    });

    gsap.ticker.lagSmoothing(0);
    this.isInitialized = true;
  }

  scrollTo(target, options = {}) {
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        offset: options.offset || 0,
        duration: options.duration || 1.2,
        immediate: ticker.prefersReducedMotion
      });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  destroy() {
    ticker.remove('lenis_scroll');
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    ScrollTrigger.getAll().forEach(st => st.kill());
    this.isInitialized = false;
  }
}

export const scrollManager = new ScrollManager();
export { gsap, ScrollTrigger };
