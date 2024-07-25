import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { Customer } from 'src/customers/domain/customer.entity';
import { CustomerRepository } from 'src/customers/repository/customer.respository';
import { CustomerService } from 'src/customers/service/customer.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Module } from '@nestjs/common';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          issuer: configService.getOrThrow<string>('JWT_ISSUER'),
          algorithm: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Customer]),
  ],
  providers: [
    CustomerService,
    CustomerRepository,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
