import { IsNotEmpty, IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class CreateProspectDto {
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString()
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  nom: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères' })
  entreprise?: string;

  @IsEmail({}, { message: 'L\'adresse email doit être valide' })
  @MaxLength(255, { message: 'L\'email ne peut pas dépasser 255 caractères' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Le téléphone ne peut pas dépasser 20 caractères' })
  telephone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Le message ne peut pas dépasser 2000 caractères' })
  message?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  source?: string;
}