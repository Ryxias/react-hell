'use strict';

/**
 * Timer util class
 */

class Timer {
  constructor() {
    this.elapsed = 0;
  }

  /**
   * Starts the API quota timer.
   */
  start() {
    const self = this;
    this.interval = setInterval(() => { self.elapsed += 1 }, 1000);
  }

  /**
   * Resets the API quota timer.
   */
  reset() {
    this.elapsed = 0;
    clearInterval(this.interval);
  }
}

module.exports = Timer;
