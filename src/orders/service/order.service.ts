import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CustomerService } from 'src/customers/service/customer.service';
import { DataSource } from 'typeorm';
import { DesiredOrderItem } from '../types/desired-order-item.type';
import { Order } from '../domain/order.entity';
import { OrderDetail } from '../domain/order-detail.entity';
import { OrderRepository } from '../repository/order.repository';
import { ProductService } from 'src/products/service/product.service';
import { Stock } from 'src/products/domain/stock.entity';
import { StockService } from 'src/products/service/stock.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerService: CustomerService,
    private readonly stockService: StockService,
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
  ) {}

  async getById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('No order found by given ID');
    }

    return order;
  }

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    const orders =
      await this.orderRepository.findOrdersByCustomerId(customerId);
    if (orders.length === 0) {
      throw new NotFoundException(
        'No orders found containing the desired product',
      );
    }

    return orders;
  }

  async getOrdersByOrderedProductId(productId: string): Promise<Order[]> {
    const orders =
      await this.orderRepository.findOrdersByOrderedProductId(productId);
    if (orders.length === 0) {
      throw new NotFoundException(
        'No orders found containing the desired product',
      );
    }

    return orders;
  }

  async placeOrder(
    newOrder: Omit<Order, 'id' | 'orderDetails' | 'customer' | 'createdAt'>,
    customerId: string,
    desiredOrderItems: DesiredOrderItem[],
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer = await this.customerService.getById(customerId);
      const orderedItemsStocks =
        await this.getOrderedItemsStocks(desiredOrderItems);

      this.validateStockAvailability(orderedItemsStocks, desiredOrderItems);

      const order = this.createOrderEntity(newOrder, customer);
      const orderDetails = this.createOrderDetails(
        order,
        orderedItemsStocks,
        desiredOrderItems,
      );
      order.orderDetails = orderDetails;
      await queryRunner.manager.save(order);
      await this.updateStocks(orderedItemsStocks, desiredOrderItems);

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrder(
    orderId: string,
    updatedOrderData: Partial<Order>,
    updatedOrderItems: DesiredOrderItem[],
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingOrder = await this.orderRepository.findById(orderId);
      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      const existingOrderDetails = existingOrder.orderDetails;
      await this.restoreStock(existingOrderDetails);

      const orderedItemsStocks =
        await this.getOrderedItemsStocks(updatedOrderItems);
      this.validateStockAvailability(orderedItemsStocks, updatedOrderItems);

      Object.assign(existingOrder, updatedOrderData);
      const updatedOrderDetails = this.createOrderDetails(
        existingOrder,
        orderedItemsStocks,
        updatedOrderItems,
      );
      existingOrder.orderDetails = updatedOrderDetails;

      await queryRunner.manager.save(existingOrder);
      await this.updateStocks(orderedItemsStocks, updatedOrderItems);

      await queryRunner.commitTransaction();
      return existingOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingOrder = await this.orderRepository.findById(orderId);
      if (!existingOrder) {
        throw new NotFoundException('No order found by given ID');
      }

      const existingOrderDetails = existingOrder.orderDetails;
      await this.restoreStock(existingOrderDetails);

      await queryRunner.manager.delete(OrderDetail, { order: { id: orderId } });
      await queryRunner.manager.delete(Order, orderId);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async restoreStock(orderDetails: OrderDetail[]) {
    for (const detail of orderDetails) {
      const stock = await this.stockService.getByProductIdAndLocationId(
        detail.product.id,
        detail.shippedFrom.id,
      );
      await this.stockService.update(
        stock.id,
        stock.quantity + detail.quantity,
      );
    }
  }

  private async getOrderedItemsStocks(
    desiredOrderItems: DesiredOrderItem[],
  ): Promise<Stock[]> {
    return await this.stockService.getStocksByProductsAndLocations(
      desiredOrderItems,
    );
  }

  private validateStockAvailability(
    orderedItemsStocks: any[],
    desiredOrderItems: DesiredOrderItem[],
  ): void {
    const insufficientStockItems = [];
    for (const item of desiredOrderItems) {
      const stock = orderedItemsStocks.find(
        (stock) =>
          stock.product.id === item.productId &&
          stock.location.id === item.locationId,
      );

      if (!stock || stock.quantity < item.desiredQuantity) {
        insufficientStockItems.push({
          productId: item.productId,
          locationId: item.locationId,
          availableQuantity: stock ? stock.quantity : 0,
          desiredQuantity: item.desiredQuantity,
        });
      }
    }

    if (insufficientStockItems.length > 0) {
      throw new BadRequestException({
        message: 'Insufficient stock for some items',
        insufficientStockItems,
      });
    }
  }

  private createOrderEntity(
    newOrder: Omit<Order, 'id' | 'orderDetails' | 'customer' | 'createdAt'>,
    customer: any,
  ): Order {
    const order = new Order();
    order.customer = customer;
    order.country = newOrder.country;
    order.city = newOrder.city;
    order.county = newOrder.county;
    order.streetAddress = newOrder.streetAddress;
    order.createdAt = new Date();
    return order;
  }

  private createOrderDetails(
    order: Order,
    orderedItemsStocks: any[],
    desiredOrderItems: DesiredOrderItem[],
  ): OrderDetail[] {
    return desiredOrderItems.map((item) => {
      const orderDetail = new OrderDetail();
      orderDetail.product = orderedItemsStocks.find(
        (stock) => stock.product.id === item.productId,
      ).product;
      orderDetail.shippedFrom = orderedItemsStocks.find(
        (stock) => stock.location.id === item.locationId,
      ).location;
      orderDetail.quantity = item.desiredQuantity;
      orderDetail.order = order;
      return orderDetail;
    });
  }

  private async updateStocks(
    orderedItemsStocks: any[],
    desiredOrderItems: DesiredOrderItem[],
  ): Promise<void> {
    for (const item of desiredOrderItems) {
      const stock = orderedItemsStocks.find(
        (stock) =>
          stock.product.id === item.productId &&
          stock.location.id === item.locationId,
      );
      await this.stockService.update(
        stock.id,
        stock.quantity - item.desiredQuantity,
      );
    }
  }
}
