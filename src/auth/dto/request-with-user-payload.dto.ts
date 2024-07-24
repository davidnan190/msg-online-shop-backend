import { Customer } from 'src/customers/domain/customer.entity';

export interface RequestWithUserPayload extends Express.Request {
  user?: Customer;
}
