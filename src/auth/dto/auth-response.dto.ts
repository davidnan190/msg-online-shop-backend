import { Customer } from 'src/customers/domain/customer.entity';
import { Tokens } from './tokens.dto';

export class AuthResponseDto {
  customer: Omit<Customer, 'password'>;
  tokens: Tokens;
}
