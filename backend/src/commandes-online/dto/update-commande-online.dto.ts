import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateCommandeOnlineDto } from './create-commande-online.dto';
import { CommandeOnlineStatus } from '../entities/commande-online.entity';

export class UpdateCommandeOnlineDto extends PartialType(CreateCommandeOnlineDto) {
  @IsEnum(CommandeOnlineStatus)
  @IsOptional()
  statut?: CommandeOnlineStatus;
}