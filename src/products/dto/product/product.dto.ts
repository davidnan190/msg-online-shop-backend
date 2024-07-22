import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryDto } from '../product-category/product-category.dto';

export class ProductDto {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({ description: 'The name of the product', example: 'Laptop' })
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A high-end gaming laptop',
  })
  description: string;

  @ApiProperty({ description: 'The price of the product', example: 1500 })
  price: number;

  @ApiProperty({ description: 'The weight of the product', example: 2.5 })
  weight: number;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://alabalaportocala.com/image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'The category of the product',
    type: ProductCategoryDto,
  })
  category: ProductCategoryDto;
}
