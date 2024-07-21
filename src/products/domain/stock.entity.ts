import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Location } from './location.entity';
import { Product } from './product.entity';

@Entity({ name: 'stocks' })
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Location, { eager: true })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column('int')
  quantity: number;
}
