import { CreateProductDto } from '../dto/product/create-product.dto';
import { Product } from '../domain/product.entity';
import { ProductCategory } from '../domain/product-category.entity';
import { ProductCategoryMapper } from './product-category.mapper';
import { ProductDto } from '../dto/product/product.dto';
import { UpdateProductDto } from '../dto/product/update-product.dto';

export class ProductMapper {
  static toDto(entity: Product): ProductDto {
    const { id, name, description, price, weight, supplier, imageUrl, category } = entity;
    return { id, name, description, price: price, weight, supplier, imageUrl, category };
  }

  static fromCreateDto(dto: CreateProductDto): Omit<Product, 'id'> {
    const { name, description, price, weight, supplier, imageUrl } = dto;
    return {
      name,
      description,
      price,
      weight,
      supplier,
      imageUrl,
      category: null,
    };
  }

  static fromUpdateDto(dto: UpdateProductDto): Product {
    const { id, name, description, price, weight, supplier, imageUrl } = dto;
    return {
      id,
      name,
      description,
      price,
      weight,
      supplier,
      imageUrl,
      category: null,
    };
  }
}
