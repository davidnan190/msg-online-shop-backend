import { CreateOrderDto } from '../dto/order/create-order.dto';
import { Order } from '../domain/order.entity';
import { OrderDto } from '../dto/order/order.dto';
import { UpdateOrderDto } from '../dto/order/update-order.dto';

export class OrderMapper {
  static toDto(order: Order): OrderDto {
    return {
      id: order.id,
      country: order.country,
      city: order.city,
      county: order.county,
      streetAddress: order.streetAddress,
      createdAt: order.createdAt,
      orderDetails: order.orderDetails.map((detail) => ({
        id: detail.id,
        product: detail.product
          ? detail.product
          : { message: 'Product no longer in stock' },
        shippedFrom: detail.shippedFrom,
        quantity: detail.quantity,
      })),
    };
  }

  static fromCreateDto(
    dto: CreateOrderDto,
  ): Omit<Order, 'id' | 'customer' | 'orderDetails' | 'createdAt'> {
    const { country, city, county, streetAddress } = dto;
    return { country, city, county, streetAddress };
  }

  static fromUpdateDto(dto: UpdateOrderDto): Partial<Order> {
    const { id, country, city, county, streetAddress } = dto;
    return { id, country, city, county, streetAddress };
  }
}
