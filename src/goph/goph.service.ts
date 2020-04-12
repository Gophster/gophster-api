import { Injectable, NotFoundException } from '@nestjs/common';
import { GophDto } from './dto/goph.dto';
import { User } from '../auth/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GophRepository } from './goph.repoistory';
import { Goph } from './goph.entity';

@Injectable()
export class GophService {
  constructor(
    @InjectRepository(GophRepository)
    private gophRepository: GophRepository,
  ) {}

  async createGoph(gophData: GophDto, user: User): Promise<Goph> {
    const goph = this.gophRepository.create({ ...gophData, author: user });
    await goph.save();

    delete goph.author;

    return goph;
  }

  async getGophsForUser(user: User): Promise<Goph[]> {
    const gophs = await this.gophRepository.find({ where: { author: user },order:{created: 'DESC'} });
    return gophs;
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
    const goph = await this.gophRepository.findOne({
      where: { id: id, author: user },
    });

    if (!goph) {
      throw new NotFoundException();
    }

    await goph.remove();

    return goph;
  }
}
