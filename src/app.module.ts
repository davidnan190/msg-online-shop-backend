import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
