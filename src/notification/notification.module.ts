import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationsGateway } from './notification.gateway';
import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationRepository } from './notification.repistory';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([NotificationRepository]),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
