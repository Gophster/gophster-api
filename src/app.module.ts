import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { AuthModule } from './auth/auth.module';
import { GophModule } from './goph/goph.module';
import { FollowModule } from './follow/follow.module';
import { NotificationModule } from './notification/notification.module';
import * as typeOrmConfig from 'config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot(),
    AuthModule,
    GophModule,
    FollowModule,
    NotificationModule,
  ],
})
export class AppModule {}
