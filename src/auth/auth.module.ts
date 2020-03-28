import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      publicKey: fs.readFileSync(
        path.join(process.cwd(), 'credentials/pub.key'),
      ),
      privateKey: fs.readFileSync(
        path.join(process.cwd(), 'credentials/private.key'),
      ),
      signOptions: {
        expiresIn: 3600,
        algorithm: 'RS256',
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
