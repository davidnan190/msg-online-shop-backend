import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The first name of the customer',
    example: 'David',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The last name of the customer',
    example: 'Andrei',
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The username of the customer',
    example: 'davidandrei123',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the customer',
    example: 'P@ssw0rd!',
  })
  password: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email address of the customer',
    example: 'david.andrei@mail.com',
  })
  emailAddress: string;
}
