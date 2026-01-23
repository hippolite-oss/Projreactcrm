import { Module } from '@nestjs/common';
import { ParametresController } from './parametres.controller';

@Module({
  controllers: [ParametresController],
})
export class ParametresModule {}