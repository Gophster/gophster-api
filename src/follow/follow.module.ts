import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { NotificationModule } from './../notification/notification.module';
import { AuthModule } from './../auth/auth.module';
import { FollowRepository } from './follow.repository';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([FollowRepository]),
    NotificationModule,
    BullModule.registerQueue({
      name: 'notification',
      redis: {
        host: 'gophster.redis',
        port: 6379,
      },
    }),
  ],
  providers: [FollowService],
  controllers: [FollowController],
  exports: [FollowService],
})
export class FollowModule {}
