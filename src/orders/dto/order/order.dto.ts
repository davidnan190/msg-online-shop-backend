import { ApiProperty } from '@nestjs/swagger';
import { OrderDetailsDto } from '../order-details/order-details.dto';

export class OrderDto {
  @ApiProperty({
    description: 'The unique identifier of the order',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'The country where the order is shipped to',
    example: 'Romania',
  })
  country: string;

  @ApiProperty({
    description: 'The city where the order is shipped to',
    example: 'Timisoara',
  })
  city: string;

  @ApiProperty({
    description: 'The county where the order is shipped to',
    example: 'Timis',
  })
  county: string;

  @ApiProperty({
    description: 'The street address where the order is shipped to',
    example: 'Bd. Cetatii 93',
  })
  streetAddress: string;

  @ApiProperty({
    description: 'The date and time when the order was created',
    example: '2024-07-21T14:48:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The details of the order',
    type: () => [OrderDetailsDto],
  })
  orderDetails: OrderDetailsDto[];
}
