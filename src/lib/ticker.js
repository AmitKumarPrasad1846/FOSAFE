/**
 * FOSAFE v2 Master Ticker & Adaptive Performance Engine
 * Single unified requestAnimationFrame loop for the entire application.
 * Manages frame budgeting, adaptive quality degradation, and tab visibility pausing.
 */

class MasterTicker {
  constructor() {
    this.tasks = new Map();
    this.isRunning = false;
    this.lastTime = performance.now();
    this.elapsedTime = 0;
    this.frameId = null;

    // Performance profiling & adaptive quality
    this.frameCount = 0;
    this.fps = 60;
    this.fpsWindow = [];
    this.qualityLevel = 'high'; // 'high' | 'medium' | 'reduced'
    this.maxDpr = Math.min(window.devicePixelRatio || 1, 2);

    // Reduced motion accessibility
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initVisibilityListener();
    this.start();
  }

  initVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
    });
  }

  add(id, callback) {
    if (typeof callback === 'function') {
      this.tasks.set(id, callback);
    }
  }

  remove(id) {
    this.tasks.delete(id);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick = this.tick.bind(this);
    this.frameId = requestAnimationFrame(this.tick);
  }

  pause() {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  resume() {
    if (!this.isRunning) {
      this.lastTime = performance.now();
      this.start();
    }
  }

  tick(currentTime) {
    if (!this.isRunning) return;

    const delta = Math.min(currentTime - this.lastTime, 100); // Clamp to avoid spiral of death
    this.lastTime = currentTime;
    this.elapsedTime += delta;

    // Adaptive frame budgeting (measure first 180 frames)
    if (this.frameCount < 180) {
      this.frameCount++;
      const currentFps = 1000 / (delta || 16.67);
      this.fpsWindow.push(currentFps);
      if (this.fpsWindow.length === 60) {
        const avgFps = this.fpsWindow.reduce((a, b) => a + b, 0) / this.fpsWindow.length;
        this.fps = Math.round(avgFps);
        if (avgFps < 52) {
          this.qualityLevel = 'reduced';
          this.maxDpr = 1;
        } else if (avgFps < 57) {
          this.qualityLevel = 'medium';
          this.maxDpr = Math.min(window.devicePixelRatio || 1, 1.25);
        }
      }
    }

    // Execute registered tasks
    for (const [id, callback] of this.tasks) {
      try {
        callback(delta, this.elapsedTime, currentTime);
      } catch (err) {
        console.error(`[Ticker Error in task "${id}"]:`, err);
      }
    }

    this.frameId = requestAnimationFrame(this.tick);
  }
}

export const ticker = new MasterTicker();
