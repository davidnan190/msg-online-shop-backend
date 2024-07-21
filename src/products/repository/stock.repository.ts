import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from '../domain/stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockRepository {
  constructor(
    @InjectRepository(Stock)
    private readonly repository: Repository<Stock>,
  ) {}

  async findById(id: string): Promise<Stock> {
    return await this.repository.findOneBy({ id });
  }

  async findByProductId(productId: string): Promise<Stock[]> {
    return await this.repository.find({
      where: { product: { id: productId } },
    });
  }

  async findByLocationId(locationId: string): Promise<Stock[]> {
    return await this.repository.find({
      where: { location: { id: locationId } },
    });
  }

  async findAll(): Promise<Stock[]> {
    return await this.repository.find();
  }

  async create(stock: Stock) {
    return this.repository.create(stock);
  }

  async save(stock: Stock): Promise<Stock> {
    return this.repository.save(stock);
  }

  async saveStocks(stocks: Stock[]): Promise<Stock[]> {
    return this.repository.save(stocks);
  }

  async findByProductIdAndLocationId(
    productId: string,
    locationId: string,
  ): Promise<Stock> {
    return await this.repository
      .createQueryBuilder('stock')
      .innerJoinAndSelect('stock.product', 'product')
      .innerJoinAndSelect('stock.location', 'location')
      .where('product.id = :productId', { productId })
      .andWhere('location.id = :locationId', { locationId })
      .getOne();
  }

  async findStocksByProductsAndLocation(
    productIds: string[],
    locationId: string,
  ): Promise<Stock[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.location', 'location')
      .where('location.id = :locationId', { locationId })
      .andWhere('product.id IN (:...productIds)', { productIds });

    return await queryBuilder.getMany();
  }

  async findProductsInStockByLocation(locationId: string): Promise<Stock[]> {
    return await this.repository
      .createQueryBuilder('stock')
      .innerJoinAndSelect('stock.product', 'product')
      .innerJoinAndSelect('stock.location', 'location')
      .where('location.id = :locationId', { locationId })
      .andWhere('stock.quantity > 0')
      .getMany();
  }

  async findStocksByProductAndLocation(
    pairs: { productId: string; locationId: string }[],
  ): Promise<Stock[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('stock')
      .innerJoinAndSelect('stock.product', 'product')
      .innerJoinAndSelect('stock.location', 'location');

    pairs.forEach((pair, index) => {
      queryBuilder.orWhere(
        `(product.id = :productId${index} AND location.id = :locationId${index})`,
        {
          [`productId${index}`]: pair.productId,
          [`locationId${index}`]: pair.locationId,
        },
      );
    });

    return await queryBuilder.getMany();
  }

  async checkAvailability(
    productId: string,
    locationId?: string,
  ): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('stock')
      .innerJoin('stock.product', 'product')
      .where('product.id = :productId', { productId });

    if (locationId) {
      queryBuilder.andWhere('stock.location.id = :locationId', { locationId });
    }

    const stock = await queryBuilder.getOne();

    return stock ? stock.quantity > 0 : false;
  }

  async update(stockId: string, quantity: number): Promise<void> {
    await this.repository.update(stockId, { quantity });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findLowStock(threshold: number): Promise<Stock[]> {
    return await this.repository
      .createQueryBuilder('stock')
      .innerJoinAndSelect('stock.product', 'product')
      .innerJoinAndSelect('stock.location', 'location')
      .where('stock.quantity < :threshold', { threshold })
      .getMany();
  }
}
