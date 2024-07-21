import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../domain/product.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { Stock } from '../domain/stock.entity';
import { SortOrder } from '../enum/sort-order.enum';
import { SortFilter } from '../enum/sort-filter.enum';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findOneById(id: string): Promise<Product> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find({ relations: ['category'] });
  }

  async findByName(name: string): Promise<Product> {
    return await this.repository.findOne({
      where: { name },
      relations: ['category'],
    });
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return await this.repository.find({
      where: { category: { id: categoryId } },
    });
  }

  async findProducts(
    categoryName?: string,
    name?: string,
    supplier?: string,
    sortFilter: SortFilter = SortFilter.NAME,
    sortOrder: SortOrder = SortOrder.ASC,
  ): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (categoryName) {
      queryBuilder.andWhere('category.name = :categoryName', { categoryName });
    }

    if (name) {
      queryBuilder.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }

    if (supplier) {
      queryBuilder.andWhere('product.supplier = :supplier', { supplier });
    }

    queryBuilder.orderBy(`product.${sortFilter}`, sortOrder);
    queryBuilder.distinct(true);

    return await queryBuilder.getMany();
  }

  async create(
    newProduct: Omit<Product, 'id'>,
    manager?: EntityManager,
  ): Promise<Product> {
    const product = this.repository.create(newProduct);
    if (manager) {
      return await manager.save(product);
    } else {
      return await this.repository.save(product);
    }
  }

  async save(product: Product, manager?: EntityManager): Promise<Product> {
    if (manager) {
      return await manager.save(product);
    } else {
      return await this.repository.save(product);
    }
  }

  async updateProduct(
    id: string,
    updatedCategory: Partial<Product>,
    manager?: EntityManager,
  ): Promise<void> {
    if (manager) {
      await manager.update(Product, id, updatedCategory);
    } else {
      await this.repository.update(id, updatedCategory);
    }
  }

  async deleteById(id: string, manager?: EntityManager): Promise<void> {
    if (manager) {
      await manager.delete(Product, id);
    } else {
      await this.repository.delete(id);
    }
  }
}
