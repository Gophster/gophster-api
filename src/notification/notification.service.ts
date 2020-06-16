import { UserRepository } from './../auth/entity/user.repository';
import { NotificationGateway } from './notification.gateway';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { NotificationRepository } from './notification.repistory';
import { Notification } from './notification.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { User } from '../auth/entity/user.entity';
import { classToPlain } from 'class-transformer';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Follow } from '../follow/follow.entity';

@Injectable()
@Processor('notification')
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: NotificationRepository,
    private userRepository: UserRepository,
    private notificationGateway: NotificationGateway,
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
      .where('user = :id', { id: user.id })
      .andWhere('read = :not', { not: false })
      .execute();

    return { success: true };
  }

  @Process('action')
  async action(job: Job<any>) {
    const { data } = job;

    const user = await this.userRepository.findOne({
      where: { id: data.reciver },
    });
    const initiator = await this.userRepository.findOne({
      where: { id: data.author },
    });

    if (user && initiator) {
      let message = 'started following you';

      if (data.action == 'unfollow') {
        message = 'unfollowed you';
      }

      const notification = await this.notificationRepository
        .create({
          user,
          initiator,
          read: false,
          text: `<b>@${initiator.handle}</b> ${message}`,
          link: `/user/${initiator.handle}`,
        })
        .save();

      if (user.socketId !== null) {
        await this.notificationGateway.notificaitonServer
          .to(user.socketId)
          .emit('notification', {
            data: classToPlain(notification),
          });
      }
    }
  }

  @Process('goph')
  async createNewGophNotification(job: Job<any>) {
    const { data } = job;

    const user = await this.userRepository.findOne(data.user);
    const recivers = await this.userRepository.manager.connection
      .createQueryBuilder()
      .select('follow.author')
      .from(Follow, 'follow')
      .where('follow.reciver = :userId')
      .setParameter('userId', user.id)
      .execute();

    let ids = [];
    if (recivers instanceof Array) {
      ids = recivers.map(({ authorId }) => authorId);
    }

    const users = await this.userRepository.find({
      where: { id: In(ids) },
    });

    for (const reciver of users) {
      const notification = await this.notificationRepository
        .create({
          user: reciver,
          initiator: user,
          read: false,
          text: `<b>@${user.handle}</b> added a new goph`,
          link: `/goph/${data.goph}`,
        })
        .save();

      if (reciver.socketId !== null) {
        await this.notificationGateway.notificaitonServer
          .to(reciver.socketId)
          .emit('notification', {
            data: classToPlain(notification),
          });
      }
    }
  }
}
