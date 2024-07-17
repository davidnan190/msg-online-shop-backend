import { ConfigModule, ConfigService } from '@nestjs/config';

import { CustomersModule } from './customers/customers.module';
import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: configService.getOrThrow('POSTGRES_PORT'),
        database: configService.getOrThrow('POSTGRES_DB'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        autoLoadEntities: configService.getOrThrow('DB_AUTOLOAD_ENTITIES'),
        //  entities: [__dirname + '/**/*.domain{.ts,.js}'],
        synchronize: configService.getOrThrow('DB_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    OrdersModule,
    ProductsModule,
    CustomersModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
