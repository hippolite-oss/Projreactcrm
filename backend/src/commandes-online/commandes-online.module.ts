import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesOnlineService } from './commandes-online.service';
import { CommandesOnlineController } from './commandes-online.controller';
import { CommandeOnline } from './entities/commande-online.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommandeOnline]),
    EmailModule,
  ],
  controllers: [CommandesOnlineController],
  providers: [CommandesOnlineService],
  exports: [CommandesOnlineService],
})
export class CommandesOnlineModule {}