import { IsString, IsNumber, IsOptional, IsNotEmpty, MaxLength, Min, IsEnum, IsUrl } from 'class-validator';
import { ProductUnit } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string; // Marque

  @IsString()
  @IsOptional()
  @IsUrl()
  image?: string; // URL de l'image

  @IsString()
  @IsOptional()
  @MaxLength(50)
  sku?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @IsEnum(ProductUnit)
  @IsOptional()
  unit?: ProductUnit;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minStockLevel?: number;
}