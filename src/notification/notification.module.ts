import { MessengerModule } from './../messenger/messenger.module';
import { ApplicationGateway } from './application.gateway';
import { UserRepository } from './../auth/entity/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationRepository } from './notification.repistory';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => MessengerModule),
    TypeOrmModule.forFeature([NotificationRepository, UserRepository]),
    BullModule.registerQueue({
      name: 'notification',
      redis: {
        host: 'gophster.redis',
        port: 6379,
      },
    }),
  ],
  providers: [NotificationService, ApplicationGateway],
  controllers: [NotificationController],
  exports: [NotificationService, ApplicationGateway],
})
export class NotificationModule {}
