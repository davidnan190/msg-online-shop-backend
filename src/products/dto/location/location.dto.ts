import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier of the location',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the location',
    example: 'msg Timisoara',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The country where the location is situated',
    example: 'Romania',
  })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The city where the location is situated',
    example: 'Timisoara',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The county where the location is situated',
    example: 'Timis',
  })
  county: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The street address of the location',
    example: 'Bd. Cetatii 93',
  })
  streetAddress: string;
}
