import { AuthResponseDto } from '../dto/auth-response.dto';
import { Customer } from 'src/customers/domain/customer.entity';
import { CustomerMapper } from 'src/customers/mapper/customer.mapper';
import { JwtPayload } from '../payload/jwt.payload';
import { RegistrationDto } from '../dto/registration.dto';
import { Tokens } from '../dto/tokens.dto';

export class AuthMapper {
  static fromRegistrationDto(dto: RegistrationDto): Omit<Customer, 'id'> {
    const { firstName, lastName, username, emailAddress, password, role } = dto;
    return { firstName, lastName, username, emailAddress, password, role };
  }

  static fromJwtPayload(payload: JwtPayload): Omit<Customer, 'password'> {
    const { sub, firstName, lastName, username, emailAddress, role } = payload;
    return { id: sub, firstName, lastName, username, emailAddress, role };
  }

  static toAuthResponseDto(
    loggedInCustomer: Customer,
    tokens: Tokens,
  ): AuthResponseDto {
    return {
      customer: CustomerMapper.toDto(loggedInCustomer),
      tokens,
    };
  }
}
