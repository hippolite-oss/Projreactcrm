import { IsString, IsEmail, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommandeOnlineDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telephone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  adresse: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ville: string;

  @IsString()
  @IsNotEmpty()
  commande: string;

  @IsString()
  @IsOptional()
  notes?: string;
}