import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';

export const CurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    return request.user.sub;
  },
);
