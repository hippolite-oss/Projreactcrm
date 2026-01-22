import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesOnlineService } from './commandes-online.service';
import { CommandesOnlineController } from './commandes-online.controller';
import { CommandeOnline } from './entities/commande-online.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommandeOnline])],
  controllers: [CommandesOnlineController],
  providers: [CommandesOnlineService],
  exports: [CommandesOnlineService],
})
export class CommandesOnlineModule {}