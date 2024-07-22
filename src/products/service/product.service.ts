import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';
import { Product } from '../domain/product.entity';
import { ProductCategoryService } from './product-category.service';
import { ProductRepository } from '../repository/product.repository';
import { SortFilter } from '../enum/sort-filter.enum';
import { SortOrder } from '../enum/sort-order.enum';
import { StockDataDto } from '../dto/stock/stock-data.dto';
import { StockService } from './stock.service';
import { Supplier } from '../enum/supplier.enum';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: ProductCategoryService,
    private readonly stockService: StockService,
    private readonly dataSource: DataSource,
  ) {}

  async findProducts(
    categoryName?: string,
    name?: string,
    supplier?: Supplier,
    sortField: SortFilter = SortFilter.NAME,
    sortOrder: SortOrder = SortOrder.ASC,
  ): Promise<Product[]> {
    return this.productRepository.findProducts(
      categoryName,
      name,
      supplier,
      sortField,
      sortOrder,
    );
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOneById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async findByName(name: string): Promise<Product> {
    const product = await this.productRepository.findByName(name);
    if (!product) {
      throw new NotFoundException('No products found by name');
    }

    return product;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.productRepository.findByCategory(categoryId);
    if (!products) {
      throw new NotFoundException('No products found by name');
    }

    return products;
  }

  async create(
    newProduct: Omit<Product, 'id'>,
    categoryId: string,
    stockData: StockDataDto[],
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this.categoryService.getById(categoryId);
      newProduct.category = category;

      const isNameAvailable = await this.isNameAvailable(newProduct.name);
      if (!isNameAvailable) {
        throw new ConflictException('A product already exists with that name');
      }

      const createdProduct = await this.productRepository.create(
        newProduct,
        queryRunner.manager,
      );

      await this.stockService.createStocksForProduct(
        createdProduct,
        stockData,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return createdProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateById(
    id: string,
    updatedProduct: Partial<Product>,
    categoryId?: string,
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingProduct = await this.productRepository.findOneById(id);
      if (!existingProduct) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      if (categoryId) {
        const category = await this.categoryService.getById(categoryId);
        updatedProduct.category = category;
      }

      if (updatedProduct.name) {
        const isUpdatedNameAvailable = await this.isNameAvailable(
          updatedProduct.name,
        );
        if (!isUpdatedNameAvailable) {
          throw new ConflictException(
            `Product with name ${updatedProduct.name} already exists`,
          );
        }
      }

      const mergedProduct = Object.assign(existingProduct, updatedProduct);
      await this.productRepository.updateProduct(
        id,
        mergedProduct,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return mergedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteById(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.productRepository.findOneById(id);
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      await this.stockService.deleteStocksByProductId(id, queryRunner.manager);
      await this.productRepository.deleteById(id, queryRunner.manager);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const product = await this.productRepository.findByName(name);
    return product ? false : true;
  }
}
