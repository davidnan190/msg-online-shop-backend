import { ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Product } from '../../domain/product.entity';
import { ProductCategory } from '../../domain/product-category.entity';
import { ProductCategoryService } from '../product-category.service';
import { ProductRepository } from '../../repository/product.repository';
import { ProductService } from '../product.service';
import { StockDataDto } from '../../dto/stock/stock-data.dto';
import { StockService } from '../stock.service';
import { Supplier } from 'src/products/enum/supplier.enum';

jest.mock('../../repository/product.repository');
jest.mock('../product-category.service');
jest.mock('../stock.service');
jest.mock('typeorm', () => ({
  DataSource: jest.fn().mockImplementation(() => ({
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
        delete: jest.fn(),
      },
      PrimaryGeneratedColumn: jest.fn(),
      Column: jest.fn(),
      Entity: jest.fn(),
    }),
  })),
}));

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<ProductRepository>;
  let categoryService: jest.Mocked<ProductCategoryService>;
  let stockService: jest.Mocked<StockService>;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        ProductRepository,
        ProductCategoryService,
        StockService,
        DataSource,
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(
      ProductRepository,
    ) as jest.Mocked<ProductRepository>;
    categoryService = module.get<ProductCategoryService>(
      ProductCategoryService,
    ) as jest.Mocked<ProductCategoryService>;
    stockService = module.get<StockService>(
      StockService,
    ) as jest.Mocked<StockService>;
    dataSource = module.get<DataSource>(DataSource);

    queryRunner = dataSource.createQueryRunner();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product successfully', async () => {
      const category = new ProductCategory();
      const newProduct = {
        name: 'New Product',
        description: 'asdasd',
        supplier: Supplier.BETHESDA_SUPPLIER,
        price: 100.0,
        category: category,
      } as Product;
      const stockData: StockDataDto[] = [{ locationId: '1', quantity: 10 }];
      const createdProduct = new Product();

      categoryService.getById.mockResolvedValue(category);
      productService.isNameAvailable = jest.fn().mockResolvedValue(true);
      productRepository.create.mockResolvedValue(createdProduct);
      stockService.createStocksForProduct.mockImplementation();

      const result = await productService.create(newProduct, '1', stockData);

      expect(result).toBe(createdProduct);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw ConflictException if product name is not available', async () => {
      productService.isNameAvailable = jest.fn().mockResolvedValue(false);

      await expect(
        productService.create({ name: 'Existing Product' } as Product, '1', []),
      ).rejects.toThrow(ConflictException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('findProducts', () => {
    it('should return products based on filters', async () => {
      const products = [new Product()];
      productRepository.findProducts.mockResolvedValue(products);

      expect(await productService.findProducts()).toBe(products);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [new Product()];
      productRepository.findAll.mockResolvedValue(products);

      expect(await productService.findAll()).toBe(products);
    });
  });

  describe('findById', () => {
    it('should return a product if found', async () => {
      const product = new Product();
      productRepository.findOneById.mockResolvedValue(product);

      expect(await productService.findById('1')).toBe(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      productRepository.findOneById.mockResolvedValue(null);

      await expect(productService.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a product if found by name', async () => {
      const product = new Product();
      productRepository.findByName.mockResolvedValue(product);

      expect(await productService.findByName('Product Name')).toBe(product);
    });

    it('should throw NotFoundException if product not found by name', async () => {
      productRepository.findByName.mockResolvedValue(null);

      await expect(productService.findByName('Product Name')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateById', () => {
    it('should update a product successfully', async () => {
      const existingProduct = new Product();
      const updatedProduct = { name: 'Updated Product' };
      const category = new ProductCategory();

      productRepository.findOneById.mockResolvedValue(existingProduct);
      categoryService.getById.mockResolvedValue(category);
      productService.isNameAvailable = jest.fn().mockResolvedValue(true);
      productRepository.updateProduct.mockResolvedValue(updatedProduct as unknown as Promise<void>);

      const result = await productService.updateById('1', updatedProduct, '1');

      expect(result).toBe(updatedProduct);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      productRepository.findOneById.mockResolvedValue(null);

      await expect(productService.updateById('1', {})).rejects.toThrow(NotFoundException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw ConflictException if product name is not available', async () => {
      productRepository.findOneById.mockResolvedValue(new Product());
      productService.isNameAvailable = jest.fn().mockResolvedValue(false);

      await expect(productService.updateById('1', { name: 'Existing Product' })).rejects.toThrow(ConflictException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('deleteById', () => {
    it('should delete a product successfully', async () => {
      const product = new Product();

      productRepository.findOneById.mockResolvedValue(product);
      stockService.deleteStocksByProductId.mockImplementation();
      productRepository.deleteById.mockImplementation();

      await productService.deleteById('1');

      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      productRepository.findOneById.mockResolvedValue(null);

      await expect(productService.deleteById('1')).rejects.toThrow(NotFoundException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
