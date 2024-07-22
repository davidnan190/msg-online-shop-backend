import { Location } from './domain/location.entity';
import { LocationRepository } from './repository/location.repository';
import { Module } from '@nestjs/common';
import { Product } from './domain/product.entity';
import { ProductCategory } from './domain/product-category.entity';
import { ProductCategoryController } from './controller/product-category.controller';
import { ProductCategoryRepository } from './repository/product-category.repository';
import { ProductCategoryService } from './service/product-category.service';
import { ProductController } from './controller/product.controller';
import { ProductRepository } from './repository/product.repository';
import { ProductService } from './service/product.service';
import { Stock } from './domain/stock.entity';
import { StockController } from './controller/stock.controller';
import { StockRepository } from './repository/stock.repository';
import { StockService } from './service/stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, Location, Stock]),
  ],
  providers: [
    ProductService,
    ProductCategoryService,
    StockService,
    ProductRepository,
    ProductCategoryRepository,
    StockRepository,
    LocationRepository,
    ProductController,
  ],
  exports: [ProductService, ProductCategoryService, StockService],
  controllers: [ProductController, ProductCategoryController, StockController],
})
export class ProductsModule {}
