import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';
import { CreateCommandeOnlineDto } from './create-commande-online.dto';
import { CommandeOnlineStatus } from '../entities/commande-online.entity';

export class UpdateCommandeOnlineDto extends PartialType(CreateCommandeOnlineDto) {
  @IsEnum(CommandeOnlineStatus)
  @IsOptional()
  statut?: CommandeOnlineStatus;

  @IsString()
  @IsOptional()
  notes_admin?: string;

  @IsString()
  @IsOptional()
  traite_par?: string;

  @IsBoolean()
  @IsOptional()
  email_reception_envoye?: boolean;

  @IsBoolean()
  @IsOptional()
  email_traitement_envoye?: boolean;

  @IsDate()
  @IsOptional()
  date_email_reception?: Date;

  @IsDate()
  @IsOptional()
  date_email_traitement?: Date;

  @IsDate()
  @IsOptional()
  date_traitement?: Date;

  @IsDate()
  @IsOptional()
  date_annulation?: Date;

  @IsString()
  @IsOptional()
  raison_annulation?: string;

  @IsString()
  @IsOptional()
  annule_par?: string;
}