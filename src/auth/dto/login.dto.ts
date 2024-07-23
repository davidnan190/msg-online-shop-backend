import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email address of the user', example: 'david.andrei@mail.com' })
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit',
  })
  @ApiProperty({ description: 'Password of the user', example: 'Password123!' })
  password: string;
}
