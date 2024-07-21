import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { StockDataDto } from '../stock/stock-data.dto';
import { Supplier } from 'src/products/enum/supplier.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the product', example: 'Laptop' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the product',
    example: 'A high-end gaming laptop',
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The price of the product', example: 1500 })
  price: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ description: 'The weight of the product', example: 2.5 })
  weight: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the product category',
    example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  categoryId: string;

  @Expose()
  @IsEnum(Supplier)
  @ApiProperty({ description: 'The supplier of the product', enum: Supplier })
  supplier: Supplier;

  @IsString()
  @Expose()
  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://alabalaportocala.com/image.jpg',
  })
  imageUrl: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Stock data of the product',
    type: [StockDataDto],
  })
  stockData: StockDataDto[];
}
