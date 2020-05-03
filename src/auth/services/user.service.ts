import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../entity/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';

import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async updateUser(
    userData: UserDto,
    avatar: Express.Multer.File,
    user: User,
  ): Promise<User> {
    for (const field in userData) {
      user[field] = userData[field];
    }

    if (avatar) {
      const oldPath = join(process.cwd(), 'assets/files/avatars', user.avatar);
      if (existsSync(oldPath)) {
        unlinkSync(join(process.cwd(), 'assets/files/avatars', user.avatar));
      }
      user.avatar = avatar.filename;
    }

    await user.save();

    return user;
  }

  async getUserByHandle(handle: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { handle } });
    if (!user) {
      throw new NotFoundException(`User ${handle} does not exists`);
    }

    return user;
  }
}
