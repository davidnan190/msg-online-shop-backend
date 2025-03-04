import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
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

import { CustomerService } from '../service/customer.service';
import { CustomerMapper } from '../mapper/customer.mapper';
import { CustomerDto } from '../dto/customer.dto';
import { Customer } from '../domain/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import {
  CUSTOMER_FEATURE_BASE_PATH,
  CUSTOMER_FEATURE_NAME,
} from '../config/customer.config';
import { AllowedRoles } from 'src/auth/decorators/allowed-roles.decorator';
import { Role } from '../enum/role.enum';
import { API_AUTH_TYPE } from 'src/constants';

@ApiTags(CUSTOMER_FEATURE_NAME)
@ApiBearerAuth(API_AUTH_TYPE)
@Controller(CUSTOMER_FEATURE_BASE_PATH)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':customerId')
  @AllowedRoles(Role.CUSTOMER, Role.ADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({
    name: 'customerId',
    description: 'The unique identifier of the customer',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    type: CustomerDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getById(@Param('customerId') customerId: string): Promise<CustomerDto> {
    return CustomerMapper.toDto(await this.customerService.getById(customerId));
  }

  @Get()
  @AllowedRoles(Role.CUSTOMER, Role.ADMIN)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'List of customers',
    type: [CustomerDto],
  })
  async getAll(): Promise<CustomerDto[]> {
    const customers = await this.customerService.getAll();
    return customers.map((customer: Customer) =>
      CustomerMapper.toDto(customer),
    );
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ status: 201, description: 'Customer registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(
    @Body() registrationDto: CreateCustomerDto,
  ): Promise<CustomerDto> {
    const createdCustomer = await this.customerService.create(
      CustomerMapper.fromCreateDto(registrationDto),
    );

    return CustomerMapper.toDto(createdCustomer);
  }

  @Patch(':customerId')
  @AllowedRoles(Role.ADMIN, Role.CUSTOMER)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiParam({
    name: 'customerId',
    description: 'The unique identifier of the customer',
  })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async update(
    @Param('customerId') customerId: string,
    @Body() updatedCustomer: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const customer = await this.customerService.updateById(
      customerId,
      CustomerMapper.fromUpdateDto(updatedCustomer),
    );

    return CustomerMapper.toDto(customer);
  }

  @Delete(':customerId')
  @AllowedRoles(Role.CUSTOMER, Role.ADMIN)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiParam({
    name: 'customerId',
    description: 'The unique identifier of the customer',
  })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async delete(
    @Param('customerId') customerId: string,
  ): Promise<{ message: string }> {
    await this.customerService.deleteById(customerId);
    return {
      message: 'Customer has been deleted successfully.',
    };
  }
}
