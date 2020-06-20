import {
  Injectable,
  BadRequestException,
  ClassSerializerInterceptor,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { FollowRepository } from './follow.repository';
import { User } from './../auth/entity/user.entity';
import { UserService } from './../auth/services/user.service';
import { Follow } from './follow.entity';
import { NotificationService } from './../notification/notification.service';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class FollowService {
  constructor(
    @InjectRepository(FollowRepository)
    public followRepository: FollowRepository,
    public userService: UserService,
    public notificationService: NotificationService,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  async createFollow(reciverHandle: string, author: User) {
    if (author.handle == reciverHandle) {
      throw new BadRequestException('Self following is not allowed');
    }
    const reciver = await this.userService.getUserByHandle(reciverHandle);

    if (await this.getFollowIfExsits(author, reciver)) {
      throw new BadRequestException('You are already following this person');
    }
    const follow = this.followRepository.create({ author, reciver });
    await follow.save();

    await this.notificationQueue.add('action', {
      reciver: reciver.id,
      author: author.id,
      action: 'follow',
    });

    return follow;
  }

  async removeFollow(reciverHandle: string, author: User): Promise<void> {
    if (author.handle == reciverHandle) {
      throw new BadRequestException('Self following is not allowed');
    }
    const reciver = await this.userService.getUserByHandle(reciverHandle);
    const follow = await this.getFollowIfExsits(author, reciver);
    if (!follow) {
      throw new BadRequestException('You are not following this person');
    }

    await this.notificationQueue.add('action', {
      reciver: reciver.id,
      author: author.id,
      action: 'unfollow',
    });

    await follow.remove();
  }

  async getFollowIfExsits(author: User, reciver: User): Promise<Follow | null> {
    const follow = await this.followRepository.findOne({
      where: { author, reciver },
    });
    if (follow) {
      return follow;
    }
    return null;
  }

  async isFollowing(handle: string, author: User): Promise<{ data: boolean }> {
    const reciver = await this.userService.getUserByHandle(handle);
    if (await this.getFollowIfExsits(author, reciver)) {
      return { data: true };
    }
    return { data: false };
  }

  async suggestions(author: User): Promise<User[]> {
    const followSuggestions = await this.userService.userRepository
      .createQueryBuilder('user')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('follow.reciver')
          .from(Follow, 'follow')
          .where('follow.author = :userId')
          .getQuery();

        return `user.id NOT IN (${subQuery})`;
      })
      .andWhere('user.id != :userId')
      .setParameter('userId', author.id)
      .orderBy('user.followersAmount', 'DESC')
      .limit(3)
      .getMany();

    return followSuggestions;
  }

  async getFollowers(author: User, userHandle: string): Promise<User[]> {
    const targetUser = await this.userService.userRepository.findOne({
      where: { handle: userHandle },
    });
    if (!targetUser) {
      throw new NotFoundException();
    }
    const followers = await this.userService.userRepository
      .createQueryBuilder('user')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('follow.author')
          .from(Follow, 'follow')
          .where('follow.reciver = :userId')
          .getQuery();

        return `user.id IN (${subQuery})`;
      })
      .andWhere('user.id != :userId')
      .setParameter('userId', targetUser.id)
      .orderBy('user.followersAmount', 'DESC')
      .getMany();

    return followers;
  }

  async getFollowings(author: User, userHandle: string): Promise<User[]> {
    const targetUser = await this.userService.userRepository.findOne({
      where: { handle: userHandle },
    });
    if (!targetUser) {
      throw new NotFoundException();
    }
    const followers = await this.userService.userRepository
      .createQueryBuilder('user')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('follow.reciver')
          .from(Follow, 'follow')
          .where('follow.author = :userId')
          .getQuery();

        return `user.id IN (${subQuery})`;
      })
      .andWhere('user.handle != :userId')
      .setParameter('userId', targetUser.id)
      .orderBy('user.followersAmount', 'DESC')
      .getMany();

    return followers;
  }
}
