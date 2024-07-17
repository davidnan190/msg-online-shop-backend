import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderDetail } from 'src/orders/domain/order-detail.entity';
import { ProductCategory } from './product-category.entity';
import { Stock } from './stock.entity';
import { Supplier } from '../enum/supplier.enum';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'double precision' })
  weight: number;

  @Column({ name: 'image_url', type: 'varchar', length: 255 })
  imageUrl: string;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  @JoinColumn({ name: 'product_category_id' })
  category: ProductCategory;

  @Column({ type: 'varchar', length: 25 })
  supplier: Supplier;

  @OneToMany(() => Stock, (stock) => stock.product)
  @JoinColumn({ name: 'stock_id' })
  stocks: Stock[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  @JoinColumn({ name: 'order_details_id' })
  orderDetails: OrderDetail[];
}
