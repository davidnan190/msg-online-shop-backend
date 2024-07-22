import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class StockDataDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the location',
    example: 'h7eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  locationId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'The quantity of stock', example: 100 })
  quantity: number;
}
