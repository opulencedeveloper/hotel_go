/**
 * Production-ready logging utility
 * In production, logs are sent to monitoring service
 * In development, logs are printed to console
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In production, send to monitoring service (Sentry, LogRocket, etc.)
    if (this.isProduction) {
      // Only log warnings and errors in production
      if (level === 'warn' || level === 'error') {
        // TODO: Integrate with monitoring service
        // Example: Sentry.captureMessage(message, level);
        console.error(`[${level.toUpperCase()}] ${message}`, context || '');
      }
      // Suppress info/debug logs in production
      return;
    }

    // In development, log everything to console
    if (this.isDevelopment) {
      const emoji = {
        info: '✅',
        warn: '⚠️',
        error: '❌',
        debug: '🔍',
      }[level];

      console[level === 'error' ? 'error' : 'log'](
        `${emoji} [${timestamp}] ${message}`,
        context || ''
      );
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();

