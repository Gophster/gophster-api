import { NotificationModule } from './../notification/notification.module';
import { AuthModule } from './../auth/auth.module';
import { FollowRepository } from './follow.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([FollowRepository]),
    NotificationModule
  ],
  providers: [FollowService],
  controllers: [FollowController],
  exports: [FollowService],
})
export class FollowModule {}
