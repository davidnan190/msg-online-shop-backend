import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

import { Role } from 'src/customers/enum/role.enum';

export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // @IsEnum(str)
  @IsNotEmpty()
  role: Role;
}
