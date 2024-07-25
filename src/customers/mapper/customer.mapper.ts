import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from '../domain/customer.entity';
import { CustomerDto } from '../dto/customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

export class CustomerMapper {
  static toDto(entity: Omit<Customer, 'password'>): CustomerDto {
    const { id, firstName, lastName, username, emailAddress, role } = entity;
    return { id, firstName, lastName, username, emailAddress, role };
  }

  static fromCreateDto(dto: CreateCustomerDto): Omit<Customer, 'id'> {
    const { firstName, lastName, password, username, emailAddress, role } = dto;
    return { firstName, lastName, password, username, emailAddress, role };
  }

  static fromUpdateDto(dto: UpdateCustomerDto): Customer {
    const { id, firstName, lastName, password, username, emailAddress, role } =
      dto;
    return { id, firstName, lastName, password, username, emailAddress, role };
  }

  static fromDto(dto: CustomerDto): Customer {
    const { id, firstName, lastName, username, emailAddress, role } = dto;
    return {
      id,
      firstName,
      lastName,
      password: null,
      username,
      emailAddress,
      role,
    };
  }
}
