import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_RESOURCE_TAG } from '../../constants/auth.constants';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublicResource = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_RESOURCE_TAG,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicResource) return true;

    return super.canActivate(context);
  }
}
