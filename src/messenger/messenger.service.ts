import { Injectable, forwardRef, Inject } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { ApplicationGateway } from '../notification/application.gateway';
import { UserService } from './../auth/services/user.service';
import { User } from './../auth/entity/user.entity';
import { MessengerRepository } from './messenger.repository';
import { Message } from './messenger.entity';
import { classToPlain } from 'class-transformer';
@Injectable()
export class MessengerService {
  constructor(
    @InjectRepository(MessengerRepository)
    public messengerRepository: MessengerRepository,
    private userService: UserService,
    @Inject(forwardRef(() => ApplicationGateway))
    private appGateway: ApplicationGateway,
  ) {}

  async getUserConversation(
    user: User,
    pair: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Message>> {
    return paginate<Message>(this.messengerRepository, options, {
      where: {
        author: In([user.id, pair]),
        reciver: In([user.id, pair]),
      },
      order: {
        created: 'ASC',
      },
    });
  }

  async getUnreadCount(user: User): Promise<{ count: number }> {
    const count = await this.messengerRepository.count({
      where: { reciver: user, read: false },
    });

    return { count };
  }

  async read(user: User, pair: string = null): Promise<{ success: boolean }> {
    const qb = this.messengerRepository
      .createQueryBuilder('message')
      .update(Message)
      .set({
        read: true,
      })
      .where('reciver = :id', { id: user.id })
      .andWhere('read = :not', { not: false });

    if (pair) {
      qb.andWhere('author = :author', { author: pair });
    }
    await qb.execute();

    return { success: true };
  }

  async createMessage(
    user: User,
    pair: string,
    text: string,
  ): Promise<Message> {
    const reciver = await this.userService.userRepository.findOne(pair);
    if (!reciver) {
      return;
    }

    const message = await this.messengerRepository
      .create({
        author: user,
        reciver: reciver,
        message: text,
        read: false,
      })
      .save();

    if (reciver.socketId) {
      await this.appGateway.server
        .to(reciver.socketId)
        .emit('new-message', classToPlain(message));
    }

    return message;
  }

  async getConversationUsers(
    user: User,
    options: IPaginationOptions,
  ): Promise<Pagination<User>> {
    const recivers = await this.messengerRepository
      .createQueryBuilder('message')
      .select('message.reciver, message.author')
      .where('message.author = :author', { author: user.id })
      .orWhere('message.reciver = :author', { author: user.id })
      .distinct(true)
      .execute();

    let ids = [];
    if (recivers instanceof Array) {
      ids = [
        ...ids,
        ...recivers.map(({ reciverId }) => {
          if (reciverId !== user.id) {
            return reciverId;
          }
        }),
      ];
      ids = [
        ...ids,
        ...recivers.map(({ authorId }) => {
          if (authorId !== user.id) {
            return authorId;
          }
        }),
      ];
    }

    return paginate<User>(this.userService.userRepository, options, {
      where: {
        id: ids.length ? In(ids) : '6395851c-baca-41de-bd98-8cdf7dc45c5a',
      },
    });
  }
}
