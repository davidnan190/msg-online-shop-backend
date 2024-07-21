import { CustomersModule } from 'src/customers/customers.module';
import { Module } from '@nestjs/common';
import { Order } from './domain/order.entity';
import { OrderController } from './controller/order.controller';
import { OrderDetail } from './domain/order-detail.entity';
import { OrderRepository } from './repository/order.repository';
import { OrderService } from './service/order.service';
import { ProductsModule } from 'src/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    ProductsModule,
    CustomersModule,
  ],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
})
export class OrdersModule {}
