import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/customers/enum/role.enum';

export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'First name of the user', example: 'David' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Last name of the user', example: 'Andrei' })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Username of the user',
    example: 'davidandrei123',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'david.andrei@mail.com',
  })
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Password of the user', example: 'alabadas' })
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  @ApiProperty({ description: 'Role of the user', enum: Role })
  role: Role;
}
