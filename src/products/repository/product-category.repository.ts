import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../domain/product-category.entity';

@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repository: Repository<ProductCategory>,
  ) {}

  async findAll(): Promise<ProductCategory[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<ProductCategory> {
    return await this.repository.findOneBy({ id: id });
  }

  async findByName(name: string): Promise<ProductCategory> {
    return await this.repository.findOneBy({ name });
  }

  async create(
    newCategory: Omit<ProductCategory, 'id'>,
  ): Promise<ProductCategory> {
    return await this.repository.save(newCategory);
  }

  async update(
    id: string,
    updatedCategory: Partial<ProductCategory>,
  ): Promise<void> {
    await this.repository.update(id, updatedCategory);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
