import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from '../location/location.dto';
import { ProductDto } from '../product/product.dto';

export class StockDto {
  @ApiProperty({
    description: 'The unique identifier of the stock',
    example: 'i8eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'The product associated with the stock',
    type: ProductDto,
  })
  product: ProductDto;

  @ApiProperty({ description: 'The quantity of stock', example: 100 })
  quantity: number;

  @ApiProperty({ description: 'The location of the stock', type: LocationDto })
  location: LocationDto;
}
