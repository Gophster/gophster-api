import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../entity/user.entity';

import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const token = context.switchToWs().getData().token;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const jwtPayload: JwtPayload = <JwtPayload>jwt.verify(
      token,
      fs.readFileSync(path.join(process.cwd(), 'credentials/pub.pem')),
      {
        algorithms: ['RS256'],
      },
    );

    const user: User = await this.authService.userRepository.findOne(
      jwtPayload.uuid,
    );

    if (user) {
      context.switchToWs().getClient().user = user;
    }

    return Boolean(user);
  }
}
