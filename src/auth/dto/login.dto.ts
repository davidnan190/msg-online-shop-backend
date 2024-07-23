import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit',
  })
  password: string;
}
