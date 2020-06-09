import { Follow } from './follow.entity';
import { UserService } from './../auth/services/user.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './../auth/entity/user.entity';
import { FollowRepository } from './follow.repository';
import {
  createQueryBuilder,
  getRepository,
} from 'typeorm';
import { Goph } from 'src/goph/goph.entity';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowRepository)
    public followRepository: FollowRepository,
    public userService: UserService,
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

  async paginateNewsFeedGophs(
    options: IPaginationOptions,
    user: User,
  ): Promise<Pagination<Goph>> {
    const newsFeedGophs = await getRepository(Goph)
      .createQueryBuilder('goph')
      .where(
        'goph.author IN (' +
          (await createQueryBuilder()
            .select('follow.reciver')
            .from(Follow, 'follow')
            .where('follow.author = :userId')
            .getQuery()) +
          ')',
      )
      .setParameter('userId', user.id)
      .orderBy('goph.created', 'DESC');
    return paginate<Goph>(newsFeedGophs, options);
  }
}
