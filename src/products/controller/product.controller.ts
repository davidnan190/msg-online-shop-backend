import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from '../service/product.service';
import { Product } from '../domain/product.entity';
import { ProductMapper } from '../mapper/product.mapper';
import { ProductDto } from '../dto/product/product.dto';
import { CreateProductDto } from '../dto/product/create-product.dto';
import { UpdateProductDto } from '../dto/product/update-product.dto';
import { Supplier } from '../enum/supplier.enum';
import { SortOrder } from '../enum/sort-order.enum';
import { SortFilter } from '../enum/sort-filter.enum';
import {
  PRODUCT_FEATURE_BASE_PATH,
  PRODUCT_FEATURE_NAME,
} from '../config/product.config';
import { AllowedRoles } from 'src/auth/decorators/allowed-roles.decorator';
import { Role } from 'src/customers/enum/role.enum';
import { API_AUTH_TYPE } from 'src/constants';

@ApiTags(PRODUCT_FEATURE_NAME)
@ApiBearerAuth(API_AUTH_TYPE)
@Controller(PRODUCT_FEATURE_BASE_PATH)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search')
  @HttpCode(200)
  @ApiOperation({ summary: 'Search products based on various filters' })
  @ApiResponse({
    status: 200,
    description: 'List of products matching the search criteria',
    type: [ProductDto],
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter products by category name',
    type: String,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter products by name',
    type: String,
  })
  @ApiQuery({
    name: 'supplier',
    required: false,
    description: 'Filter products by supplier',
    enum: Supplier,
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    description: 'Field to sort by',
    enum: SortFilter,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Order to sort by',
    enum: SortOrder,
  })
  async searchProducts(
    @Query('category') categoryName?: string,
    @Query('name') name?: string,
    @Query('supplier') supplier?: Supplier,
    @Query('sortField') sortField: SortFilter = SortFilter.NAME,
    @Query('sortOrder') sortOrder: SortOrder = SortOrder.ASC,
  ): Promise<ProductDto[]> {
    const foundProducts = await this.productService.findProducts(
      categoryName,
      name,
      supplier,
      sortField,
      sortOrder,
    );

    return foundProducts.map((product: Product) =>
      ProductMapper.toDto(product),
    );
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [ProductDto],
  })
  async getAll(): Promise<ProductDto[]> {
    const products = await this.productService.findAll();
    return products.map((product: Product) => ProductMapper.toDto(product));
  }

  @Get(':productId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'The product', type: ProductDto })
  async getById(@Param('productId') productId: string): Promise<ProductDto> {
    const product = await this.productService.findById(productId);
    return ProductMapper.toDto(product);
  }

  @Post()
  @AllowedRoles(Role.ADMIN)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The created product',
    type: ProductDto,
  })
  async create(@Body() newProduct: CreateProductDto): Promise<ProductDto> {
    const createdProduct = await this.productService.create(
      ProductMapper.fromCreateDto(newProduct),
      newProduct.categoryId,
      newProduct.stockData,
    );
    return ProductMapper.toDto(createdProduct);
  }

  @Patch(':productId')
  @AllowedRoles(Role.ADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been updated successfully.',
    type: ProductDto,
  })
  async update(
    @Param('productId') productId: string,
    @Body() updatedProductData: UpdateProductDto,
  ): Promise<ProductDto> {
    const updatedProduct = await this.productService.updateById(
      productId,
      ProductMapper.fromUpdateDto(updatedProductData),
      updatedProductData.categoryId,
    );

    return ProductMapper.toDto(updatedProduct);
  }

  @Delete(':productId')
  @AllowedRoles(Role.ADMIN)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 204,
    description: 'The product has been deleted successfully.',
  })
  async delete(@Param('productId') productId: string): Promise<void> {
    return await this.productService.deleteById(productId);
  }
}
