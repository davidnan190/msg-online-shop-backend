import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Customer } from 'src/customers/domain/customer.entity';
import { JwtPayload } from '../payload/jwt.payload';
import { Request } from 'express'

export const FromCurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();

    if (!data) return request.user as Customer;

    return request.user[data];
  },
);
