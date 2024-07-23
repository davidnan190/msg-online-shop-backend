import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../enum/role.enum';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 25 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 25 })
  lastName: string;

  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'email_address', type: 'varchar', length: 25 })
  emailAddress: string;

  @Column({ name: 'role', type: 'varchar', length: 25 })
  role: Role
}
