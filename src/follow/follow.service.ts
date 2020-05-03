import { Follow } from './follow.entity';
import { UserService } from './../auth/services/user.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './../auth/entity/user.entity';
import { FollowRepository } from './follow.repository';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowRepository)
    public followRepository: FollowRepository,
    public userService: UserService,
  ) {}

  async createFollow(reciverId: string, author: User) {
    if (author.id == reciverId) {
      throw new BadRequestException('Self following is not allowed');
    }
    const reciver = await this.userService.getUserByHandle(reciverId);

    if (await this.getFollowIfExsits(author, reciver)) {
      throw new BadRequestException('You are already following this person');
    }
    const follow = this.followRepository.create({ author, reciver });
    await follow.save();

    return follow;
  }

  async removeFollow(reciverId: string, author: User): Promise<void> {
    if (author.id == reciverId) {
      throw new BadRequestException('Self following is not allowed');
    }
    const reciver = await this.userService.getUserByHandle(reciverId);
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
}
