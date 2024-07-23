import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { HealthController } from './health.controller';
import { JwtGuard } from './auth/guards/authentication/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { RouteRolesGuard } from './auth/guards/authorization/route-roles.guard';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${(process.env.NODE_ENV as string) || 'dev'}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: configService.getOrThrow<number>('POSTGRES_PORT'),
        database: configService.getOrThrow<string>('POSTGRES_DB'),
        username: configService.getOrThrow<string>('POSTGRES_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        autoLoadEntities: configService.getOrThrow<boolean>(
          'DB_AUTOLOAD_ENTITIES',
        ),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || false,
        logging: configService.get<boolean>('LOG_QUERIES') || false,
        logger: 'advanced-console',
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    OrdersModule,
    ProductsModule,
    CustomersModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RouteRolesGuard,
    },
  ],
})
export class AppModule {}
