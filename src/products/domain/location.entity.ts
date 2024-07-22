import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 15 })
  country: string;

  @Column({ type: 'varchar', length: 15 })
  city: string;

  @Column({ type: 'varchar', length: 15 })
  county: string;

  @Column({ name: 'street_address', type: 'varchar', length: 25 })
  streetAddress: string;
}
