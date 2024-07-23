import * as bcrypt from 'bcryptjs';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Customer } from 'src/customers/domain/customer.entity';
import { CustomerService } from 'src/customers/service/customer.service';
import { JwtPayload } from '../payload/jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    emailAddress: string,
    password: string,
  ): Promise<Omit<Customer, 'password'>> {
    const customer = await this.customerService.getByEmailAddress(emailAddress);
    await this.validatePassword(password, customer.password);
    return customer;
  }

  async login(
    loggedInCustomer: Customer,
  ): Promise<{ customer: Customer; tokens: Tokens }> {
    return {
      customer: loggedInCustomer,
      tokens: await this.generateTokens(loggedInCustomer),
    };
  }

  async register(newCustomer: Omit<Customer, 'id'>): Promise<void> {
    this.customerService.create(newCustomer);
  }

  async refreshToken(customerId: string): Promise<{ accessToken: string }> {
    const customer = await this.customerService.getById(customerId);
    return {
      accessToken: await this.generateAccessToken(customer)
    };
  }

  private async generateTokens(customer: Customer): Promise<Tokens> {
    const payload = this.buildTokenPayload(customer);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(customer: Customer): Promise<string> {
    const payload = this.buildTokenPayload(customer);

    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL'),
    });
  }

  private buildTokenPayload(customer: Customer): JwtPayload {
    return {
      ...customer,
      sub: customer.id,
    };
  }

  private async validatePassword(
    plainPassword: string,
    storedPassword: string,
  ) {
    const passwordMatches = await bcrypt.compare(plainPassword, storedPassword);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  private handleAuthError(error: Error): void {
    if (
      error instanceof NotFoundException ||
      error instanceof UnauthorizedException
    ) {
      throw new UnauthorizedException('Invalid credentials.');
    } else if (error instanceof ConflictException) {
      throw new UnauthorizedException('Email already exists.');
    }
    throw new InternalServerErrorException('An error occurred.');
  }
}
