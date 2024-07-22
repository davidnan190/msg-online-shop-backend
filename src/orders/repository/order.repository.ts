import { Repository } from 'typeorm';
import { Order } from '../domain/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  async create(newOrder: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    return await this.repository.save(newOrder);
  }

  async findById(id: string): Promise<Order> {
    return await this.repository.findOneBy({ id });
  }

  async findOrdersByCustomerId(id: string): Promise<Order[]> {
    return await this.repository.find({ where: { customer: { id } } });
  }

  async findOrdersByOrderedProductId(id: string): Promise<Order[]> {
    return await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .where('product.id = :id', { id })
      .getMany();
  }
}
