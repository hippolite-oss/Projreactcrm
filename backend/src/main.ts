import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  // Log des variables d'environnement pour debug
  console.log('🔧 Configuration Backend:');
  console.log('  PORT:', process.env.PORT);
  console.log('  CORS_ORIGIN:', process.env.CORS_ORIGIN);
  console.log('  NODE_ENV:', process.env.NODE_ENV);

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  console.log('🌐 CORS configuré pour:', corsOrigin);
  
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
  const usersService = app.get(UsersService);

  const existing = await usersService.findByEmail('admin@test.com');
  if (!existing) {
    await usersService.create('admin@test.com', 'admin123');
    console.log('Admin créé : admin@test.com / admin123');
  } else {
    console.log('Admin existe déjà');
  }
  // ----------------------------------

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
}

bootstrap();
