import {
  createCustomer,
  createLocation,
  createProduct,
  createProductCategory,
  createStock,
} from './db.factories';

import { Customer } from 'src/customers/domain/customer.entity';
import { DataSource } from 'typeorm';
import { Location } from 'src/products/domain/location.entity';
import { Order } from 'src/orders/domain/order.entity';
import { OrderDetail } from 'src/orders/domain/order-detail.entity';
import { Product } from 'src/products/domain/product.entity';
import { Stock } from 'src/products/domain/stock.entity';

export class DatabaseUtils {
  constructor(private dataSource: DataSource) {}

  async seedDatabase() {
    const manager = this.dataSource.manager;

    const customer = createCustomer();
    await manager.save(customer);

    const location = createLocation();
    await manager.save(location);

    const category = createProductCategory();
    await manager.save(category);

    const product = createProduct(category);
    await manager.save(product);

    const stock = createStock(product, location);
    await manager.save(stock);

    return { customer, product, location, stock };
  }

  async clearDatabase() {
    const manager = this.dataSource.manager;
    await manager.delete(OrderDetail, {});
    await manager.delete(Order, {});
    await manager.delete(Stock, {});
    await manager.delete(Product, {});
    await manager.delete(Location, {});
    await manager.delete(Customer, {});
  }
}
