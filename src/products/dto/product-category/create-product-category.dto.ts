import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the product category',
    example: 'Electronics',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the product category',
    example: 'Electronic gadgets and devices',
  })
  description: string;
}
