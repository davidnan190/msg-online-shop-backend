import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ALLOWED_ROLES_TAG } from '../../constants/auth.constants';
import { Customer } from 'src/customers/domain/customer.entity';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from 'src/customers/enum/role.enum';

@Injectable()
export class RouteRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<Role[]>(
      ALLOWED_ROLES_TAG,
      context.getHandler(),
    );

    if (!allowedRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as Customer;
    console.log(user)

    return allowedRoles.some(
      (allowedRole: Role) => user.role === allowedRole,
    );
  }
}
