// Simple client-side logger utility
class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    this.currentLevel = process.env.NODE_ENV === 'development' ? 3 : 1;
  }

  log(level, message, data = {}) {
    if (this.levels[level] <= this.currentLevel) {
      const timestamp = new Date().toISOString();
      const logData = {
        timestamp,
        level,
        message,
        ...data
      };

      // Console logging
      console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, data);

      // Send to external logging service if available
      if (window.errorReporting && level === 'error') {
        window.errorReporting.captureMessage(message, {
          level,
          extra: data
        });
      }

      // Store in localStorage for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        try {
          const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
          logs.push(logData);
          // Keep only last 100 logs
          if (logs.length > 100) {
            logs.shift();
          }
          localStorage.setItem('app_logs', JSON.stringify(logs));
        } catch (e) {
          console.warn('Failed to store log in localStorage:', e);
        }
      }
    }
  }

  error(message, data = {}) {
    this.log('error', message, data);
  }

  warn(message, data = {}) {
    this.log('warn', message, data);
  }

  info(message, data = {}) {
    this.log('info', message, data);
  }

  debug(message, data = {}) {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();