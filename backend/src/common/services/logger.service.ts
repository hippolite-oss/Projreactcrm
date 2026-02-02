import { Injectable, Logger, LogLevel } from '@nestjs/common';

export interface LogContext {
  userId?: number;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
}

@Injectable()
export class AppLoggerService extends Logger {
  private readonly isDevelopment = process.env.NODE_ENV === 'development';
  private readonly isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    super('AppLogger');
  }

  /**
   * Log d'une requête HTTP
   */
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    context?: LogContext
  ) {
    const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;
    
    if (this.isDevelopment) {
      const emoji = this.getStatusEmoji(statusCode);
      const coloredMessage = `${emoji} ${message}`;
      
      if (context) {
        this.log(`${coloredMessage} | User: ${context.userEmail || 'Anonymous'} | IP: ${context.ip}`);
      } else {
        this.log(coloredMessage);
      }
    } else {
      // En production, log structuré
      const logData = {
        type: 'http_request',
        method,
        url,
        statusCode,
        responseTime,
        timestamp: new Date().toISOString(),
        ...context
      };
      
      if (statusCode >= 400) {
        this.error(JSON.stringify(logData));
      } else {
        this.log(JSON.stringify(logData));
      }
    }
  }

  /**
   * Log d'une erreur avec contexte
   */
  logError(error: Error, context?: LogContext, additionalInfo?: any) {
    const errorData = {
      type: 'error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...context,
      ...additionalInfo
    };

    if (this.isDevelopment) {
      this.error(`❌ ${error.message}`, error.stack);
      if (context) {
        this.error(`Context: ${JSON.stringify(context, null, 2)}`);
      }
    } else {
      this.error(JSON.stringify(errorData));
    }
  }

  /**
   * Log d'une action utilisateur
   */
  logUserAction(
    action: string,
    resource: string,
    context: LogContext,
    additionalData?: any
  ) {
    const actionData = {
      type: 'user_action',
      action,
      resource,
      timestamp: new Date().toISOString(),
      ...context,
      ...additionalData
    };

    if (this.isDevelopment) {
      this.log(`👤 ${context.userEmail} ${action} ${resource}`);
    } else {
      this.log(JSON.stringify(actionData));
    }
  }

  /**
   * Log de performance
   */
  logPerformance(
    operation: string,
    duration: number,
    context?: LogContext,
    metadata?: any
  ) {
    const perfData = {
      type: 'performance',
      operation,
      duration,
      timestamp: new Date().toISOString(),
      ...context,
      ...metadata
    };

    if (this.isDevelopment) {
      const emoji = duration > 1000 ? '🐌' : duration > 500 ? '⚠️' : '⚡';
      this.log(`${emoji} ${operation} completed in ${duration}ms`);
    } else {
      this.log(JSON.stringify(perfData));
    }
  }

  private getStatusEmoji(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return '✅';
    if (statusCode >= 300 && statusCode < 400) return '↩️';
    if (statusCode >= 400 && statusCode < 500) return '⚠️';
    if (statusCode >= 500) return '❌';
    return '📝';
  }

  /**
   * Méthodes de convenance pour remplacer console.log
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      this.log(`ℹ️ ${message}`);
    } else {
      const logData = {
        type: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...context
      };
      this.log(JSON.stringify(logData));
    }
  }

  success(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      this.log(`✅ ${message}`);
    } else {
      const logData = {
        type: 'success',
        message,
        timestamp: new Date().toISOString(),
        ...context
      };
      this.log(JSON.stringify(logData));
    }
  }

  warning(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      this.warn(`⚠️ ${message}`);
    } else {
      const logData = {
        type: 'warning',
        message,
        timestamp: new Date().toISOString(),
        ...context
      };
      this.warn(JSON.stringify(logData));
    }
  }
}