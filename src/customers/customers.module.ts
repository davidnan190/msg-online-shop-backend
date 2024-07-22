import { Customer } from './domain/customer.entity';
import { CustomerController } from './controller/customer.controller';
import { CustomerRepository } from './repository/customer.respository';
import { CustomerService } from './service/customer.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService, CustomerRepository],
  controllers: [CustomerController],
})
export class CustomersModule {}
