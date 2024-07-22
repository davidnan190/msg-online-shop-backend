import { LocationMapper } from '../../products/mapper/location-mapper';
import { OrderDetail } from '../domain/order-detail.entity';
import { OrderDetailsDto } from '../dto/order-details/order-details.dto';
import { ProductMapper } from 'src/products/mapper/product.mapper';

export class OrderDetailMapper {
  static toDto(entity: OrderDetail): OrderDetailsDto {
    const { id, product, shippedFrom, quantity } = entity;
    return {
      id,
      product: product
        ? ProductMapper.toDto(product)
        : { message: 'Product no longer in stock' },
      shippedFrom: LocationMapper.toDto(shippedFrom),
      quantity,
    };
  }

  static toDtoList(entities: OrderDetail[]): OrderDetailsDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
