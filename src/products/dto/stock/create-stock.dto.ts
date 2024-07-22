import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the location',
    example: 'g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  locationId: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'The quantity of stock', example: 100 })
  quantity: number;
}
