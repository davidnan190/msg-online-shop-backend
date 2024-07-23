import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { Customer } from 'src/customers/domain/customer.entity';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'emailAddress' });
  }

  async validate(
    emailAddress: string,
    password: string,
  ): Promise<Omit<Customer, 'password'>> {
    const existingCustomer = await this.authService.validateUser(emailAddress, password);
    
    if (!existingCustomer) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return existingCustomer;
  }
}
