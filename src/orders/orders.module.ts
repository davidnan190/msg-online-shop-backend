import { Module } from '@nestjs/common';
import { Order } from './domain/order.entity';
import { OrderDetail } from './domain/order-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail])],
})
export class OrdersModule {}
