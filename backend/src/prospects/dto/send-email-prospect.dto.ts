import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class SendEmailProspectDto {
  @IsNotEmpty()
  @IsString()
  template: string; // 'welcome', 'qualification', 'proposal'

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsObject()
  variables?: Record<string, any>;
}