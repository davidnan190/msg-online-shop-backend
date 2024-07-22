import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDetailsDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the order detail',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

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

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'The quantity of the product being ordered',
    example: 3,
    required: false,
  })
  quantity?: number;
}
