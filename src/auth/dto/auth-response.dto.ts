import { ApiProperty } from '@nestjs/swagger';
import { Customer } from 'src/customers/domain/customer.entity';
import { Tokens } from './tokens.dto';

export class AuthResponseDto {
  @ApiProperty({ description: 'Logged in customer details' })
  customer: Omit<Customer, 'password'>;

  @ApiProperty({ description: 'JWT tokens' })
  tokens: Tokens;
}
