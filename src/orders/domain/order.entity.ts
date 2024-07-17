import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Customer } from 'src/customers/domain/customer.entity';
import { OrderDetail } from './order-detail.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  county: string;

  @Column({ name: 'street_address', type: 'varchar', length: 25 })
  streetAddress: string;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  @JoinColumn({ name: 'order_details_id' })
  orderDetails: OrderDetail[];
}
