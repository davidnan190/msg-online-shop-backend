import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryDto {
  @ApiProperty({
    description: 'The unique identifier of the product category',
    example: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the product category',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the product category',
    example: 'Electronic gadgets and devices',
  })
  description: string;
}
