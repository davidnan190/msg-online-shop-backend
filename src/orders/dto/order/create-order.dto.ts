import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { DesiredOrderItem } from '../../types/desired-order-item.type';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The country where the order is shipped to',
    example: 'Romania',
  })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The city where the order is shipped to',
    example: 'Timisoara',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The county where the order is shipped to',
    example: 'Timis',
  })
  county: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the customer placing the order',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  customerId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The street address where the order is shipped to',
    example: 'Bd. Cetatii 93',
  })
  streetAddress: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'The items desired in the order',
    type: [DesiredOrderItem],
  })
  desiredOrderItems: DesiredOrderItem[];
}
