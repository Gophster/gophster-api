import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './entity/user.repository';
import { JwtStrategy } from './services/jwt.strategy';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

import * as path from 'path';
import * as fs from 'fs';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      publicKey: fs.readFileSync(
        path.join(process.cwd(), 'credentials/pub.pem'),
      ),
      privateKey: fs.readFileSync(
        path.join(process.cwd(), 'credentials/private.pem'),
      ),
      signOptions: {
        expiresIn: 3600,
        algorithm: 'RS256',
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, JwtStrategy, UserService],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
