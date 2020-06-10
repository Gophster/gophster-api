import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NotificationRepository } from './notification.repistory';
import { Notification } from './notification.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { User } from '../auth/entity/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: NotificationRepository,
  ) {}

  async paginateUserNotifications(
    options: IPaginationOptions,
    user: User,
  ): Promise<Pagination<Notification>> {
    return paginate<Notification>(this.notificationRepository, options, {
      where: { user: user },
      order: { created: 'DESC' },
    });
  }

  async getUnreadCount(user: User): Promise<{ count: number }> {
    const count = await this.notificationRepository.count({
      where: { user: user, read: false },
    });

    return { count };
  }

  async readAll(user: User): Promise<{ success: boolean }> {
    await this.notificationRepository
      .createQueryBuilder('notification')
      .update(Notification)
      .set({
        read: true,
      })
      .andWhere('id = :id', { id: user.id })
      .andWhere('read = :not', { not: false })
      .execute();

    return { success: true };
  }
}
