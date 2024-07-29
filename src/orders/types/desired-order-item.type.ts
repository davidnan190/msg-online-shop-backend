import { ApiProperty } from '@nestjs/swagger';

export class DesiredOrderItem {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  productId: string;

  @ApiProperty({
    description:
      'The unique identifier of the location from where the product is shipped',
    example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
  })
  locationId: string;

  @ApiProperty({
    description: 'The desired quantity of the product',
    example: 3,
  })
  quantity: number;
}
