import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { LocationRepository } from '../repository/location.repository';
import { Product } from '../domain/product.entity';
import { ProductRepository } from '../repository/product.repository';
import { Stock } from '../domain/stock.entity';
import { StockRepository } from '../repository/stock.repository';

@Injectable()
export class StockService {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly productRepository: ProductRepository,
    private readonly locationRepository: LocationRepository,
  ) {}

  async getStocks(productId?: string, locationId?: string): Promise<Stock[]> {
    if (productId && locationId) {
      return [await this.getByProductIdAndLocationId(productId, locationId)];
    } else if (productId) {
      return await this.getStocksByProductId(productId);
    } else if (locationId) {
      return await this.getStocksByLocationId(locationId);
    } else {
      return await this.stockRepository.findAll();
    }
  }

  async getByProductIdAndLocationId(
    productId: string,
    locationId: string,
  ): Promise<Stock> {
    return await this.stockRepository.findByProductIdAndLocationId(
      productId,
      locationId,
    );
  }

  async getById(stockId: string): Promise<Stock> {
    return await this.stockRepository.findById(stockId);
  }

  async getStocksByProductId(productId: string): Promise<Stock[]> {
    return await this.stockRepository.findByProductId(productId);
  }

  async getStocksByLocationId(locationId: string): Promise<Stock[]> {
    return await this.stockRepository.findByLocationId(locationId);
  }

  async getStocksByProductsAndLocation(
    productIds: string[],
    locationId: string,
  ): Promise<Stock[]> {
    return this.stockRepository.findStocksByProductsAndLocation(
      productIds,
      locationId,
    );
  }

  async getTotalStockByProduct(productId: string): Promise<number> {
    const stocks = await this.stockRepository.findByProductId(productId);
    if (!stocks || stocks.length === 0) {
      throw new NotFoundException('No stocks found for product with given ID');
    }
    return stocks.reduce((total, stock) => total + stock.quantity, 0);
  }

  async createStock(
    productId: string,
    locationId: string,
    quantity: number,
  ): Promise<Stock> {
    const product = await this.productRepository.findOneById(productId);
    if (!product) {
      throw new NotFoundException(
        'No product found by ID when creating a stock for it',
      );
    }

    const location = await this.locationRepository.findById(locationId);
    if (!location) {
      throw new NotFoundException(
        'No location found by given ID when creating a stock',
      );
    }

    const existingStock =
      await this.stockRepository.findByProductIdAndLocationId(
        productId,
        locationId,
      );
    if (existingStock) {
      throw new ConflictException(
        'Stock already exists for the specified product and location',
      );
    }

    const newStock = new Stock();
    newStock.product = product;
    newStock.location = location;
    newStock.quantity = quantity;

    return await this.stockRepository.save(newStock);
  }

  async createStocksForProduct(
    product: Product,
    stockData: { locationId: string; quantity: number }[],
    manager: EntityManager,
  ): Promise<Stock[]> {
    const stocks: Stock[] = [];

    for (const data of stockData) {
      const location = await this.locationRepository.findById(data.locationId);
      if (!location) {
        throw new NotFoundException(
          'No location found by given ID when creating a stock',
        );
      }

      const newStock = new Stock();
      newStock.product = product;
      newStock.location = location;
      newStock.quantity = data.quantity;

      stocks.push(await manager.save(newStock));
    }

    return stocks;
  }

  async getStocksByProductsAndLocations(
    desiredOrderItems: {
      productId: string;
      locationId: string;
    }[],
  ): Promise<Stock[]> {
    return await this.stockRepository.findStocksByProductAndLocation(
      desiredOrderItems,
    );
  }

  async update(
    stockId: string,
    newQuantity: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repository = manager
      ? manager.getRepository(Stock)
      : this.stockRepository;
    await repository.update(stockId, newQuantity);
  }

  async updateByProduct(
    productId: string,
    locationId: string,
    quantity: number,
  ): Promise<void> {
    const productStock = await this.getByProductIdAndLocationId(
      productId,
      locationId,
    );

    if (!productStock) {
      throw new NotFoundException(
        'Desired product not in stock in the specified location',
      );
    }

    await this.stockRepository.update(productStock.id, quantity);
  }

  async deleteStocksByProductId(
    productId: string,
    manager: EntityManager,
  ): Promise<void> {
    const stocks = await this.stockRepository.findByProductId(productId);
    if (!stocks || stocks.length === 0) {
      throw new NotFoundException('No stocks found for product with given ID');
    }

    for (const stock of stocks) {
      await manager.delete(Stock, stock.id);
    }
  }

  checkAvailability(availableStock: Stock, desiredQuantity: number): boolean {
    if (desiredQuantity < 0) return false;
    return availableStock.quantity - desiredQuantity >= 0;
  }

  async delete(id: string): Promise<void> {
    const stock = await this.getById(id);
    await this.stockRepository.delete(stock.id);
  }

  async getLowStock(threshold: number): Promise<Stock[]> {
    return await this.stockRepository.findLowStock(threshold);
  }

  async getTotalStockValue(): Promise<number> {
    const stocks = await this.stockRepository.findAll();
    let totalValue = 0;
    for (const stock of stocks) {
      totalValue += stock.quantity * stock.product.price;
    }
    return totalValue;
  }
}
