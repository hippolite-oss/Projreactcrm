import { IsString, IsNumber, IsOptional, IsNotEmpty, MaxLength, Min, IsArray, ValidateNested, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @IsOptional()
  productId?: number;
}

export class CreateInvoiceDto {
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  terms?: string;
}