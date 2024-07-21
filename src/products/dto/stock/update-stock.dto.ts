import { IsNotEmpty, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: 'j9eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the location',
    example: 'k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  locationId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'The quantity of stock', example: 100 })
  quantity: number;
}
