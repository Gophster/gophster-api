import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../entity/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';

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
  ): Promise<Partial<User>> {
    for (const field in userData) {
      user[field] = userData[field];
    }

    if (avatar) {
      user.avatar = avatar.filename;
    }

    await user.save();

    return this.createUserResponse(user);
  }

  async getUserByHandle(handle: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { handle } });
    if (!user) {
      throw new NotFoundException(`User ${handle} does not exists`);
    }

    return this.createUserResponse(user);
  }

  async createUserResponse(user: User): Promise<User> {
    user.avatar = `${process.env.API_URL}/user/avatars/${user.avatar}`;
    return user;
  }
}
