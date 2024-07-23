import { Customer } from 'src/entities/customer.entity';

declare module 'express' {
  export interface Request {
    user?: Customer;
  }
}
