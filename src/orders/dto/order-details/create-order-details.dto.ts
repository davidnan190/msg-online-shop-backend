import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDetailDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier of the product being ordered',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  productId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description:
      'The unique identifier of the location from where the product is shipped',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  locationId: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The quantity of the product being ordered',
    example: 3,
  })
  quantity: number;
}
