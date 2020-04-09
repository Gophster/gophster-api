import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserRepository } from './user.repository';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from './user.entity';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: fs.readFileSync(
        path.join(process.cwd(), 'credentials/pub.pem'),
      ),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { uuid } = payload;
    const user = await this.userRepository.findOne({ id: uuid });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
