import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductCategory } from '../domain/product-category.entity';
import { CreateProductCategoryDto } from '../dto/product-category/create-product-category.dto';
import { ProductCategoryDto } from '../dto/product-category/product-category.dto';
import { UpdateProductCategoryDto } from '../dto/product-category/update-product-category.dto';
import { ProductCategoryMapper } from '../mapper/product-category.mapper';
import { ProductCategoryService } from '../service/product-category.service';
import { ProductMapper } from '../mapper/product.mapper';
import {
  CATEGORY_FEATURE_BASE_PATH,
  CATEGORY_FEATURE_NAME,
} from '../config/product-category.config';

@ApiTags(CATEGORY_FEATURE_NAME)
@Controller(CATEGORY_FEATURE_BASE_PATH)
export class ProductCategoryController {
  constructor(private readonly categoryService: ProductCategoryService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({
    status: 200,
    description: 'List of all product categories',
    type: [ProductCategoryDto],
  })
  async getAll(): Promise<ProductCategoryDto[]> {
    const categories = await this.categoryService.getAll();
    return categories.map((category: ProductCategory) =>
      ProductCategoryMapper.toDto(category),
    );
  }

  @Get(':categoryId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get product category by ID' })
  @ApiResponse({
    status: 200,
    description: 'The product category',
    type: ProductCategoryDto,
  })
  async getById(
    @Param('categoryId') categoryId: string,
  ): Promise<ProductCategoryDto> {
    const product = await this.categoryService.getById(categoryId);
    return ProductCategoryMapper.toDto(product);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiResponse({
    status: 201,
    description: 'The created product category',
    type: ProductCategoryDto,
  })
  async create(
    @Body() newProduct: CreateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    const createdProduct = await this.categoryService.create(
      ProductCategoryMapper.fromCreateDto(newProduct),
    );
    return ProductCategoryMapper.toDto(createdProduct);
  }

  @Patch(':categoryId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update an existing product category' })
  @ApiResponse({
    status: 200,
    description: 'The product category has been updated successfully.',
    type: ProductCategoryDto,
  })
  async update(
    @Param('categoryId') categoryId: string,
    @Body() updatedCategory: UpdateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    const category = await this.categoryService.update(
      categoryId,
      ProductCategoryMapper.fromUpdateDto(updatedCategory),
    );
    return ProductCategoryMapper.toDto(category);
  }

  @Delete(':categoryId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiResponse({
    status: 204,
    description: 'The product category has been deleted successfully.',
  })
  async delete(
    @Param('categoryId') categoryId: string,
  ): Promise<{ message: string }> {
    await this.categoryService.delete(categoryId);
    return {
      message: 'Product category has been updated successfully.',
    };
  }
}
