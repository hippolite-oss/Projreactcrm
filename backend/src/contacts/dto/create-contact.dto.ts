import { IsString, IsEmail, IsOptional, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  position?: string;

  @IsNumber()
  @IsOptional()
  clientId?: number;
}