import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProductCategory } from '../domain/product-category.entity';
import { ProductCategoryRepository } from '../repository/product-category.repository';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly categoryRepository: ProductCategoryRepository) {}

  async getAll(): Promise<ProductCategory[]> {
    return await this.categoryRepository.findAll();
  }

  async getById(id: string): Promise<ProductCategory> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('No category found by given ID');
    }
    return category;
  }

  async getByName(name: string): Promise<ProductCategory> {
    const category = await this.categoryRepository.findByName(name);
    if (!category) {
      throw new NotFoundException('No category found by given name');
    }
    return category;
  }

  async create(
    newCategory: Omit<ProductCategory, 'id'>,
  ): Promise<ProductCategory> {
    const isNameAvailable = await this.isNameAvailable(newCategory.name);
    if (!isNameAvailable) {
      throw new ConflictException(
        `Category with name ${newCategory.name} already exists`,
      );
    }
    return await this.categoryRepository.create(newCategory);
  }

  async update(
    id: string,
    updatedCategory: Partial<ProductCategory>,
  ): Promise<ProductCategory> {
    await this.getById(id);

    if (updatedCategory.name) {
      const isUpdatedNameAvailable = await this.isNameAvailable(
        updatedCategory.name,
      );
      if (!isUpdatedNameAvailable) {
        throw new ConflictException(
          `Category with name ${updatedCategory.name} already exists`,
        );
      }
    }

    await this.categoryRepository.update(id, updatedCategory);
    return this.categoryRepository.findById(id);
  }

  async delete(id: string): Promise<void> {
    const category = await this.getById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    await this.categoryRepository.deleteById(id);
  }

  private async isNameAvailable(name: string): Promise<boolean> {
    const category = await this.categoryRepository.findByName(name);
    return category ? false : true;
  }
}
