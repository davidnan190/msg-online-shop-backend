import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Location } from 'src/products/domain/location.entity';
import { Order } from './order.entity';
import { Product } from 'src/products/domain/product.entity';

@Entity({ name: 'order_details' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Location, { eager: true })
  @JoinColumn({ name: 'shipment_from_id' })
  shippedFrom: Location;

  @Column('int')
  quantity: number;
}
