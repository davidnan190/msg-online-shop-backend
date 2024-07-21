import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StockService } from '../service/stock.service';
import { UpdateStockDto } from '../dto/stock/update-stock.dto';
import { UpdateStockQuantityDto } from '../dto/stock/update-stock-quantity.dto';
import { StockDto } from '../dto/stock/stock.dto';
import { StockMapper } from '../mapper/stock.mapper';
import { CreateStockDto } from '../dto/stock/create-stock.dto';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get stocks based on product and/or location' })
  @ApiResponse({ status: 200, description: 'List of stocks', type: [StockDto] })
  async getStocks(
    @Query('productId') productId: string,
    @Query('locationId') locationId: string,
  ): Promise<StockDto[]> {
    const foundStock = await this.stockService.getStocks(productId, locationId);
    return foundStock.length > 0
      ? foundStock.map((stock) => StockMapper.toDto(stock))
      : [];
  }

  @Get('analytics/low-stock')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get items with low stock' })
  @ApiResponse({
    status: 200,
    description: 'List of items with low stock',
    type: [StockDto],
  })
  async getLowStock(
    @Query('threshold') threshold: number,
  ): Promise<StockDto[]> {
    const lowStockItems = await this.stockService.getLowStock(threshold);
    return lowStockItems.map((stock) => StockMapper.toDto(stock));
  }

  @Get('analytics/stock-value/:productId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get total stock for a specific product' })
  @ApiResponse({
    status: 200,
    description: 'The total stock for the specified product',
    type: Number,
  })
  async getTotalStockByProduct(
    @Param('productId') productId: string,
  ): Promise<number> {
    return await this.stockService.getTotalStockByProduct(productId);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new stock' })
  @ApiResponse({
    status: 201,
    description: 'The created stock',
    type: StockDto,
  })
  async createStock(
    @Body() createStockData: CreateStockDto,
  ): Promise<StockDto> {
    const newStock = await this.stockService.createStock(
      createStockData.locationId,
      createStockData.productId,
      createStockData.quantity,
    );
    return StockMapper.toDto(newStock);
  }

  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update stock by product and location' })
  @ApiResponse({
    status: 200,
    description: 'Stock has been updated successfully.',
  })
  async updateByProductAndLocation(
    @Body() updateStockData: UpdateStockDto,
  ): Promise<{ message: string }> {
    await this.stockService.updateByProduct(
      updateStockData.productId,
      updateStockData.locationId,
      updateStockData.quantity,
    );
    return {
      message: 'Stock has been updated successfully.',
    };
  }

  @Put(':stockId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update stock quantity by stock ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock quantity has been updated successfully.',
  })
  async updateQuantity(
    @Param('stockId') stockId: string,
    @Body() updatedQuantity: UpdateStockQuantityDto,
  ): Promise<{ message: string }> {
    await this.stockService.update(stockId, updatedQuantity.quantity);
    return {
      message: 'Stock has been updated successfully.',
    };
  }

  @Delete(':stockId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete stock by stock ID' })
  @ApiResponse({
    status: 204,
    description: 'Stock has been deleted successfully.',
  })
  async delete(
    @Param('stockId') stockId: string,
  ): Promise<{ message: string }> {
    await this.stockService.delete(stockId);
    return {
      message: 'Stock has been deleted successfully.',
    };
  }
}
