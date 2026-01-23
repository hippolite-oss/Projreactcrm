import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class TraiterCommandeDto {
  @IsString()
  @IsOptional()
  notes_admin?: string;

  @IsBoolean()
  @IsOptional()
  envoyer_email?: boolean = true; // Par défaut, envoyer l'email
}

export class AnnulerCommandeDto {
  @IsString()
  @IsOptional()
  raison_annulation?: string;

  @IsBoolean()
  @IsOptional()
  envoyer_email?: boolean = true; // Par défaut, envoyer l'email d'annulation
}