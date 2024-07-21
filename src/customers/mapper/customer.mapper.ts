import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from '../domain/customer.entity';
import { CustomerDto } from '../dto/customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

export class CustomerMapper {
  static toDto(entity: Customer): CustomerDto {
    const { id, firstName, lastName, username, emailAddress } = entity;
    return { id, firstName, lastName, username, emailAddress };
  }

  static fromCreateDto(dto: CreateCustomerDto): Omit<Customer, 'id'> {
    const { firstName, lastName, password, username, emailAddress } = dto;
    return { firstName, lastName, password, username, emailAddress };
  }

  static fromUpdateDto(dto: UpdateCustomerDto): Customer {
    const { id, firstName, lastName, password, username, emailAddress } = dto;
    return { id, firstName, lastName, password, username, emailAddress };
  }
}
