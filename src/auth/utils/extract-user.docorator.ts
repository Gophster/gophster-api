import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entity/user.entity';

export const ExtractUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
