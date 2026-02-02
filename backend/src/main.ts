import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { AppLoggerService } from './common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Récupérer le service de logging
  const logger = app.get(AppLoggerService);
  
  // Configuration du logging
  logger.info('🚀 Démarrage de l\'application CRM Backend');
  logger.info(`🔧 Configuration Backend:
    PORT: ${process.env.PORT || 3001}
    CORS_ORIGIN: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}
    NODE_ENV: ${process.env.NODE_ENV || 'development'}
    DATABASE_URL: ${process.env.DATABASE_URL ? 'Configuré' : 'Non configuré'}
    DB_HOST: ${process.env.DB_HOST || 'localhost'}`);

  // Enable CORS - Support pour plusieurs origines en production
  const corsOrigin = process.env.NODE_ENV === 'production' 
    ? [process.env.CORS_ORIGIN, process.env.FRONTEND_URL].filter(Boolean)
    : process.env.CORS_ORIGIN || 'http://localhost:5173';
    
  logger.info(`🌐 CORS configuré pour: ${Array.isArray(corsOrigin) ? corsOrigin.join(', ') : corsOrigin}`);
  
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // --- Créer un admin au démarrage ---
  try {
    const usersService = app.get(UsersService);
    const existing = await usersService.findByEmail('admin@test.com');
    
    if (!existing) {
      await usersService.create('admin@test.com', 'admin123');
      logger.success('Admin créé : admin@test.com / admin123');
    } else {
      logger.info('Admin existe déjà');
    }
  } catch (error) {
    logger.logError(error, {}, { context: 'admin_creation' });
  }
  // ----------------------------------

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); // Écouter sur toutes les interfaces pour Render
  logger.success(`🎯 Application running on port ${port}`);
  logger.info('📊 Logging des requêtes HTTP activé');
}

bootstrap().catch((error) => {
  console.error('❌ Erreur fatale au démarrage:', error);
  process.exit(1);
});
