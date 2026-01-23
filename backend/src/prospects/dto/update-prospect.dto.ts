import { IsOptional, IsString, IsEmail, IsEnum, MaxLength } from 'class-validator';
import { ProspectStatus } from '../entities/prospect.entity';

export class UpdateProspectDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  entreprise?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsOptional()
  @IsEnum(ProspectStatus)
  statut?: ProspectStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes_admin?: string;
}