import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'The quantity of stock', example: 100 })
  quantity: number;
}
