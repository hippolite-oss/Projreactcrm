import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProspectsService } from './prospects.service';
import { ProspectsController } from './prospects.controller';
import { Prospect } from './entities/prospect.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prospect]),
    EmailModule, // Pour l'envoi d'emails
  ],
  controllers: [ProspectsController],
  providers: [ProspectsService],
  exports: [ProspectsService], // Pour utiliser dans d'autres modules si nécessaire
})
export class ProspectsModule {}