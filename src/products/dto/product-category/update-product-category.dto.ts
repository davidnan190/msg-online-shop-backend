import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the product category',
    example: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The name of the product category',
    example: 'Electronics',
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The description of the product category',
    example: 'Electronic devices',
    required: false,
  })
  description?: string;
}
