import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { JwtPayload } from '../payload/jwt.payload';
import { RequestWithUserPayload } from '../dto/request-with-user-payload.dto';

export const FromCurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUserPayload>();

    if (!data) return request.user;

    return request.user[data];
  },
);
