import { CreateProductCategoryDto } from '../dto/product-category/create-product-category.dto';
import { ProductCategory } from '../domain/product-category.entity';
import { ProductCategoryDto } from '../dto/product-category/product-category.dto';
import { UpdateProductCategoryDto } from '../dto/product-category/update-product-category.dto';

export class ProductCategoryMapper {
  static toDto(entity: ProductCategory): ProductCategoryDto {
    const { id, name, description } = entity;
    return { id, name, description };
  }

  static fromCreateDto(
    dto: CreateProductCategoryDto,
  ): Omit<ProductCategory, 'id'> {
    const { name, description } = dto;
    return { name, description };
  }

  static fromDto(dto: ProductCategoryDto): ProductCategory {
    const { id, name, description } = dto;
    return { id, name, description };
  }

  static fromUpdateDto(dto: UpdateProductCategoryDto): ProductCategory {
    const { id, name, description } = dto;
    return { id, name, description };
  }
}
