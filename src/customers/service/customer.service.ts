import * as bcrypt from 'bcryptjs';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Customer } from '../domain/customer.entity';
import { CustomerRepository } from '../repository/customer.respository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async getAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async getById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneById(id);
    if (!customer) {
      throw new NotFoundException('No customer found by the given ID');
    }
    return customer;
  }

  async getByEmailAddress(emailAddress: string): Promise<Customer> {
    const customer =
      await this.customerRepository.findByEmailAddress(emailAddress);
    if (!customer) {
      throw new NotFoundException('No customer found by the given email');
    }

    return customer;
  }

  async isEmailAvailable(emailAddress: string): Promise<boolean> {
    const customer =
      await this.customerRepository.findByEmailAddress(emailAddress);

    return customer ? false : true;
  }

  async create(newCustomer: Omit<Customer, 'id' | 'createdAt'>): Promise<void> {
    const isEmailAvailable = await this.isEmailAvailable(
      newCustomer.emailAddress,
    );
    if (!isEmailAvailable) {
      throw new HttpException(
        'A customer already exists with that email',
        HttpStatus.BAD_REQUEST,
      );
    }

    newCustomer.password = this.hashPassword(newCustomer.password);

    await this.customerRepository.create(newCustomer);
  }

  async updateById(
    id: string,
    updatedCustomer: Partial<Customer>,
  ): Promise<void> {
    const customer = await this.getById(id);

    if (
      updatedCustomer.emailAddress &&
      !this.isEmailAvailable(updatedCustomer.emailAddress)
    ) {
      throw new HttpException(
        'A customer already exists with that email',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.customerRepository.updateById(id, updatedCustomer);
  }

  async deleteById(id: string): Promise<void> {
    await this.getById(id);
    await this.customerRepository.deleteById(id);
  }

  private hashPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(12));
  }
}
