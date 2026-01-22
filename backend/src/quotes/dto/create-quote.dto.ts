import { IsString, IsNumber, IsOptional, IsNotEmpty, MaxLength, Min, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuoteItemDto {
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

export class CreateQuoteDto {
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
  @Type(() => CreateQuoteItemDto)
  items: CreateQuoteItemDto[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  terms?: string;
}