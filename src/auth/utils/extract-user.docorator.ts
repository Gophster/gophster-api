import { createParamDecorator } from '@nestjs/common';
import { User } from '../entity/user.entity';

export const ExtractUser = createParamDecorator(
  (data, req): User => {
    return req.user;
  },
);
