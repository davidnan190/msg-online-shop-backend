import { Customer } from '../domain/customer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {}

  async findOneById(id: string): Promise<Customer> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(): Promise<Customer[]> {
    return this.repository.find();
  }

  async findByEmailAddress(emailAddress: string): Promise<Customer> {
    return await this.repository.findOneBy({ emailAddress });
  }

  async create(newCustomer: Omit<Customer, 'id'>): Promise<Customer> {
    return await this.repository.save(newCustomer);
  }

  async updateById(
    id: string,
    updatedCustomer: Partial<Customer>,
  ): Promise<void> {
    await this.repository.update(id, updatedCustomer);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
