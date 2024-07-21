import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Supplier } from 'src/products/enum/supplier.enum';

export class UpdateProductDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The name of the product',
    example: 'Laptop',
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The description of the product',
    example: 'A high-end gaming laptop',
    required: false,
  })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The price of the product',
    example: 1500,
    required: false,
  })
  price?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The weight of the product',
    example: 2.5,
    required: false,
  })
  weight?: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'The unique identifier of the product category',
    example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: false,
  })
  categoryId?: string;

  @IsEnum(Supplier)
  @IsOptional()
  @ApiProperty({
    description: 'The supplier of the product',
    enum: Supplier,
    required: false,
  })
  supplier: Supplier;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  imageUrl?: string;
}
