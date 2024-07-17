import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { OrderDetail } from 'src/orders/domain/order-detail.entity';
import { Stock } from './stock.entity';

@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15 })
  name: string;

  @Column({ type: 'varchar', length: 15 })
  country: string;

  @Column({ type: 'varchar', length: 15 })
  city: string;

  @Column({ type: 'varchar', length: 15 })
  county: string;

  @Column({ name: 'street_address', type: 'varchar', length: 25 })
  streetAddress: string;

  @OneToMany(() => Stock, (stock) => stock.location)
  stocks: Stock[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.shippedFrom)
  @JoinColumn({ name: 'order_details_id' })
  orderDetails: OrderDetail[];
}
