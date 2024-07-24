import { Customer } from 'src/customers/domain/customer.entity';
import { Location } from 'src/products/domain/location.entity';
import { Order } from 'src/orders/domain/order.entity';
import { OrderDetail } from 'src/orders/domain/order-detail.entity';
import { Product } from 'src/products/domain/product.entity';
import { ProductCategory } from 'src/products/domain/product-category.entity';
import { Stock } from 'src/products/domain/stock.entity';

export const createCustomer = (): Customer => {
  const customer = new Customer();
  customer.firstName = 'David';
  customer.lastName = 'Andrei';
  customer.emailAddress = 'david@mail.com';
  return customer;
};

export const createProductCategory = (): ProductCategory => {
  const category = new ProductCategory();
  category.name = 'IT';
  category.description = 'This is a sample cateogry';
  return category;
};

export const createProduct = (category: ProductCategory): Product => {
  const product = new Product();
  product.name = 'Laptop';
  product.description = 'sample product';
  product.price = 100.0;
  product.category = category;
  return product;
};

export const createLocation = (): Location => {
  const location = new Location();
  location.name = 'msg centre';
  location.country = 'Romnania';
  location.county = 'Timis';
  location.city = 'Timisoara';
  location.streetAddress = 'Bd. Cetatii 93';
  return location;
};

export const createStock = (product: Product, location: Location): Stock => {
  const stock = new Stock();
  stock.product = product;
  stock.location = location;
  stock.quantity = 100;
  return stock;
};

export const createOrder = (customer: Customer): Order => {
  const order = new Order();
  order.customer = customer;
  order.country = 'Romania';
  order.city = 'Timisoara';
  order.county = 'Timis';
  order.streetAddress = 'Bd. Cetatii 93';
  order.orderDetails = [];
  return order;
};

export const createOrderDetail = (
  order: Order,
  product: Product,
  location: Location,
): OrderDetail => {
  const orderDetail = new OrderDetail();
  orderDetail.order = order;
  orderDetail.product = product;
  orderDetail.shippedFrom = location;
  orderDetail.quantity = 5;
  return orderDetail;
};
