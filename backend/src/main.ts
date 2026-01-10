import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // frontend
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

  await app.listen(3001);
  console.log('Application running on http://localhost:3001');
}

bootstrap();
