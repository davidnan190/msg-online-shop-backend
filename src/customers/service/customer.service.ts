import * as bcrypt from 'bcryptjs';

import {
  ConflictException,
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

  async create(
    newCustomer: Omit<Customer, 'id' | 'createdAt'>,
  ): Promise<Omit<Customer, 'password'>> {
    const isEmailAvailable = await this.isEmailAvailable(
      newCustomer.emailAddress,
    );
    if (!isEmailAvailable) {
      throw new ConflictException('A customer already exists with that email');
    }

    newCustomer.password = this.hashPassword(newCustomer.password);

    return await this.customerRepository.create(newCustomer);
  }

  async updateById(
    id: string,
    updatedCustomer: Omit<Partial<Customer>, 'password'>,
  ): Promise<Omit<Customer, 'password'>> {
    const customer = await this.getById(id);

    if (
      updatedCustomer.emailAddress &&
      !this.isEmailAvailable(updatedCustomer.emailAddress)
    ) {
      throw new ConflictException('A customer already exists with that email');
    }

    await this.customerRepository.updateById(id, updatedCustomer);

    return this.customerRepository.findOneById(id);
  }

  async deleteById(id: string): Promise<void> {
    await this.getById(id);
    await this.customerRepository.deleteById(id);
  }

  private hashPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(12));
  }
}
