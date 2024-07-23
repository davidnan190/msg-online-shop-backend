import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { OrderMapper } from '../mapper/order.mapper';
import { OrderService } from '../service/order.service';
import { UpdateOrderDto } from '../dto/order/update-order.dto';
import { OrderDto } from '../dto/order/order.dto';
import {
  ORDER_FEATURE_BASE_PATH,
  ORDER_FEATURE_NAME,
} from '../config/orders.config';
import { API_AUTH_TYPE } from 'src/constants';

@ApiTags(ORDER_FEATURE_NAME)
@ApiBearerAuth(API_AUTH_TYPE)
@Controller(ORDER_FEATURE_BASE_PATH)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':orderId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieve an order by ID' })
  @ApiParam({
    name: 'orderId',
    description: 'The unique identifier of the order',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: OrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(@Param('orderId') orderId: string): Promise<OrderDto> {
    const order = await this.orderService.getById(orderId);
    return OrderMapper.toDto(order);
  }

  @Get('customer/:customerId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieve orders by customer ID' })
  @ApiParam({
    name: 'customerId',
    description: 'The unique identifier of the customer',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [OrderDto],
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getOrdersByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<OrderDto[]> {
    const orders = await this.orderService.getOrdersByCustomerId(customerId);
    return orders.map((order) => OrderMapper.toDto(order));
  }

  @Get('product/:productId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieve orders by product ID' })
  @ApiParam({
    name: 'productId',
    description: 'The unique identifier of the product',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [OrderDto],
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getOrdersByProductId(
    @Param('productId') productId: string,
  ): Promise<OrderDto[]> {
    const orders =
      await this.orderService.getOrdersByOrderedProductId(productId);
    return orders.map((order) => OrderMapper.toDto(order));
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Place a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order placed successfully',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async placeOrder(@Body() dto: CreateOrderDto): Promise<OrderDto> {
    const newOrder = OrderMapper.fromCreateDto(dto);
    const createdOrder = await this.orderService.placeOrder(
      newOrder,
      dto.customerId,
      dto.desiredOrderItems,
    );
    return OrderMapper.toDto(createdOrder);
  }

  @Patch(':orderId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({
    name: 'orderId',
    description: 'The unique identifier of the order',
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: OrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderDto> {
    const updatedOrderData = OrderMapper.fromUpdateDto(dto);
    const order = await this.orderService.updateOrder(
      orderId,
      updatedOrderData,
      dto.desiredOrderItems,
    );
    return OrderMapper.toDto(order);
  }

  @Delete(':orderId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({
    name: 'orderId',
    description: 'The unique identifier of the order',
  })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async deleteOrder(
    @Param('orderId') orderId: string,
  ): Promise<{ message: string }> {
    await this.orderService.deleteOrder(orderId);
    return {
      message: 'Order has been deleted successfully.',
    };
  }
}
