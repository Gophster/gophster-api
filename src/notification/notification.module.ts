import { UserRepository } from './../auth/entity/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationRepository } from './notification.repistory';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([NotificationRepository, UserRepository]),
    BullModule.registerQueue({
      name: 'notification',
      redis: {
        host: 'gophster.redis',
        port: 6379,
      },
    }),
  ],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
