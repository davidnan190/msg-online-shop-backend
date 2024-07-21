import { LocationMapper } from './location-mapper';
import { ProductMapper } from './product.mapper';
import { Stock } from '../domain/stock.entity';
import { StockDto } from '../dto/stock/stock.dto';

export class StockMapper {
  static toDto(entity: Stock): StockDto {
    const { id, product, location, quantity } = entity;
    return {
      id,
      product: ProductMapper.toDto(product),
      location: LocationMapper.toDto(location),
      quantity,
    };
  }
}
