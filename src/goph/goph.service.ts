import { Reply } from 'src/reply/reply.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GophDto } from './dto/goph.dto';
import { User } from '../auth/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GophRepository } from './goph.repoistory';
import { Goph } from './goph.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Follow } from '../follow/follow.entity';
import { In } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class GophService {
  constructor(
    @InjectRepository(GophRepository)
    public gophRepository: GophRepository,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  async createGoph(gophData: GophDto, user: User): Promise<Goph> {
    const goph = this.gophRepository.create({ ...gophData, author: user });
    await goph.save();

    await this.notificationQueue.add('goph', {
      user: user.id,
      goph: goph.id,
    });

    return goph;
  }

  async getGophsForUser(user: User): Promise<Goph[]> {
    const gophs = await this.gophRepository.find({
      where: { author: user },
      order: { created: 'DESC' },
    });
    return gophs;
  }

  async paginateUserGophs(
    options: IPaginationOptions,
    user: User,
  ): Promise<Pagination<Goph>> {
    return paginate<Goph>(this.gophRepository, options, {
      where: { author: user },
      order: { created: 'DESC' },
    });
  }

  async getSinlgeGophById(id: string): Promise<Goph> {
    const goph = await this.gophRepository.findOne(id);
    if (!goph) {
      throw new NotFoundException();
    }

    return goph;
  }

  async patchGoph(id: string, updatedGoph: GophDto, user: User): Promise<Goph> {
    const goph = await this.gophRepository.findOne({
      where: { id: id, author: user },
    });

    if (!goph) {
      throw new NotFoundException();
    }

    await this.gophRepository.update(id, updatedGoph);

    await goph.reload();

    return goph;
  }

  async deleteGoph(id: string, user: User): Promise<Goph> {
    await this.gophRepository.manager.connection
      .createQueryBuilder()
      .delete()
      .from(Reply)
      .where('goph.id = :id', { id })
      .execute();

    const goph = await this.gophRepository.findOne({
      where: { id: id, author: user },
    });

    if (!goph) {
      throw new NotFoundException();
    }

    await goph.remove();

    return goph;
  }

  async paginateNewsFeedGophs(
    options: IPaginationOptions,
    user: User,
  ): Promise<Pagination<Goph>> {
    const recivers = await this.gophRepository.manager.connection
      .createQueryBuilder()
      .select('follow.reciver')
      .from(Follow, 'follow')
      .where('follow.author = :userId')
      .setParameter('userId', user.id)
      .execute();

    let ids = [];
    if (recivers instanceof Array) {
      ids = recivers.map(({ reciverId }) => reciverId);
    }

    return paginate<Goph>(this.gophRepository, options, {
      where: { author: In([...ids, user.id]) },
      order: { created: 'DESC' },
    });
  }
}
