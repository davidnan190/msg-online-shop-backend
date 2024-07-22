import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier of the customer',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The first name of the customer',
    example: 'David',
    required: false,
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The last name of the customer',
    example: 'Andrei',
    required: false,
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The username of the customer',
    example: 'davidandrei123',
    required: false,
  })
  username?: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword()
  @ApiProperty({
    description: 'The password of the customer',
    example: 'P@ssw0rd!',
    required: false,
  })
  password?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'The email address of the customer',
    example: 'david.andrei@mail.com',
    required: false,
  })
  emailAddress?: string;
}
