import { Injectable } from '@nestjs/common';
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
    const gophs = await this.gophRepository.find({ where: { author: user } });
    return gophs;
  }
}
