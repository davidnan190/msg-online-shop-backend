import { Location } from './domain/location.entity'
import { Module } from '@nestjs/common';
import { Product } from './domain/product.entity';
import { ProductCategory } from './domain/product-category.entity';
import { Stock } from './domain/stock.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory, Location, Stock])],
})
export class ProductsModule {}
