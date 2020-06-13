import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { GophModule } from './goph/goph.module';
import { FollowModule } from './follow/follow.module';

import * as typeOrmConfig from 'config/typeorm.config';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot(),
    AuthModule,
    GophModule,
    FollowModule,
    ReplyModule,
  ],
})
export class AppModule {}
