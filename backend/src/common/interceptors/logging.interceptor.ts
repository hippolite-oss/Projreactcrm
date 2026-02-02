import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { AppLoggerService, LogContext } from '../services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    
    // Générer un ID unique pour la requête
    const requestId = this.generateRequestId();
    
    // Ajouter l'ID à la requête pour le traçage
    (request as any).requestId = requestId;

    // Extraire les informations utilisateur si disponibles
    const user = (request as any).user;
    const logContext: LogContext = {
      requestId,
      ip,
      userAgent,
      userId: user?.id,
      userEmail: user?.email,
    };

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Logger la requête réussie
          this.logger.logRequest(method, url, statusCode, responseTime, logContext);

          // Logger les actions utilisateur importantes
          if (user && this.isImportantAction(method, url)) {
            this.logger.logUserAction(
              this.getActionName(method, url),
              this.getResourceName(url),
              logContext,
              { responseTime, statusCode }
            );
          }
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Logger l'erreur
          this.logger.logRequest(method, url, statusCode, responseTime, logContext);
          this.logger.logError(error, logContext, {
            method,
            url,
            responseTime,
            statusCode
          });
        },
      }),
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isImportantAction(method: string, url: string): boolean {
    // Actions importantes à logger
    const importantPatterns = [
      /\/auth\/(login|logout)/,
      /\/(clients|products|quotes|invoices|prospects)$/,
      /\/(clients|products|quotes|invoices|prospects)\/\d+$/,
      /\/commandes-online/,
      /\/reports/,
      /\/dashboard/,
    ];

    // Exclure les GET simples sauf pour certaines ressources
    if (method === 'GET' && !url.includes('/reports') && !url.includes('/dashboard')) {
      return false;
    }

    return importantPatterns.some(pattern => pattern.test(url));
  }

  private getActionName(method: string, url: string): string {
    if (url.includes('/login')) return 'LOGIN';
    if (url.includes('/logout')) return 'LOGOUT';
    
    switch (method) {
      case 'POST': return 'CREATE';
      case 'PUT': 
      case 'PATCH': return 'UPDATE';
      case 'DELETE': return 'DELETE';
      case 'GET': 
        if (url.includes('/reports')) return 'EXPORT_REPORT';
        if (url.includes('/dashboard')) return 'VIEW_DASHBOARD';
        return 'VIEW';
      default: return method;
    }
  }

  private getResourceName(url: string): string {
    // Extraire le nom de la ressource de l'URL
    const segments = url.split('/').filter(s => s && s !== 'api');
    
    if (segments.length === 0) return 'unknown';
    
    const resource = segments[0];
    
    // Mapper les noms de ressources
    const resourceMap: { [key: string]: string } = {
      'clients': 'CLIENT',
      'products': 'PRODUCT',
      'quotes': 'QUOTE',
      'invoices': 'INVOICE',
      'prospects': 'PROSPECT',
      'commandes-online': 'ONLINE_ORDER',
      'contacts': 'CONTACT',
      'categories': 'CATEGORY',
      'reports': 'REPORT',
      'dashboard': 'DASHBOARD',
      'auth': 'AUTH',
      'users': 'USER',
    };

    return resourceMap[resource] || resource.toUpperCase();
  }
}