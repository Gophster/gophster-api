import { ApplicationGateway } from './notification/application.gateway';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MessengerModule } from './messenger/messenger.module';

import { AuthModule } from './auth/auth.module';
import { GophModule } from './goph/goph.module';
import { FollowModule } from './follow/follow.module';
import { NotificationModule } from './notification/notification.module';
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
    NotificationModule,
    MessengerModule,
  ],
})
export class AppModule {}
