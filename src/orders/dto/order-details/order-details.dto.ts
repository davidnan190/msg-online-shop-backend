import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from 'src/products/dto/location/location.dto';
import { ProductDto } from 'src/products/dto/product/product.dto';

export class OrderDetailsDto {
  @ApiProperty({
    description: 'The unique identifier of the order detail',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'The product being ordered',
    type: () => ProductDto,
  })
  product: ProductDto | { message: string };

  @ApiProperty({
    description: 'The location from where the product is shipped',
    type: () => LocationDto,
  })
  shippedFrom: LocationDto;

  @ApiProperty({
    description: 'The quantity of the product being ordered',
    example: 3,
  })
  quantity: number;
}
