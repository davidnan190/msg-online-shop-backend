import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { DesiredOrderItem } from 'src/orders/types/desired-order-item.type';

export class UpdateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the order',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The country where the order is shipped to',
    example: 'Romania',
    required: false,
  })
  country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The city where the order is shipped to',
    example: 'Timisoara',
    required: false,
  })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The county where the order is shipped to',
    example: 'Timis',
    required: false,
  })
  county?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The street address where the order is shipped to',
    example: 'Bd. Cetatii 93',
    required: false,
  })
  streetAddress?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the customer placing the order',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  customerId: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'The items desired in the order',
    type: [DesiredOrderItem],
  })
  desiredOrderItems: DesiredOrderItem[];
}
