import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { RequestWithUserPayload } from '../dto/request-with-user-payload.dto';

export const CurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUserPayload>();
    return request.user.id;
  },
);
