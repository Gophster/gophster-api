import { ReplyRepository } from './reply.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReplyDto } from './dto/reply.dto';
import { Reply } from './reply.entity';
import { User } from 'src/auth/entity/user.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { GophService } from 'src/goph/goph.service';
@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(ReplyRepository)
    public replyRepository: ReplyRepository,
    private gophService: GophService,
  ) {}

  async createReply(replyData: ReplyDto, user: User): Promise<Reply> {
    const gophData = await this.gophService.getSinlgeGophById(replyData.goph);
    if (!gophData) {
      throw new NotFoundException();
    }
    return await this.replyRepository
      .create({ text: replyData.text, author: user, goph: gophData })
      .save();
  }

  async getRepliesForGoph(
    gophIdentificator: string,
    user: User,
  ): Promise<Reply[]> {
    const replies = await this.replyRepository.find({
      where: { goph: gophIdentificator },
      order: { created: 'DESC' },
    });
    return replies;
  }

  async getSingleReplyById(id: string): Promise<Reply> {
    const reply = await this.replyRepository.findOne(id);
    if (!reply) {
      throw new NotFoundException();
    }
    return reply;
  }

  async patchReply(
    id: string,
    updatedReply: ReplyDto,
    user: User,
  ): Promise<Reply> {
    const gophData = await this.gophService.getSinlgeGophById(
      updatedReply.goph,
    );
    const reply = await this.replyRepository.findOne(id);
    if (!reply) {
      throw new NotFoundException();
    }
    await this.replyRepository.update(id, {
      id: id,
      text: updatedReply.text,
      goph: gophData,
      author: user,
    });
    await reply.reload();
    return reply;
  }

  async deleteReply(id: string): Promise<Reply> {
    const reply = await this.replyRepository.findOne({
      where: { id: id },
    });
    if (!reply) {
      throw new NotFoundException();
    }

    await reply.remove();
    return reply;
  }

  async paginateGophReplies(
    options: IPaginationOptions,
    gophIdentificator: string,
  ): Promise<Pagination<Reply>> {
    const gophReplies = this.replyRepository
      .createQueryBuilder('reply')
      .where('reply.goph = :gophId')
      .setParameter('gophId', gophIdentificator)
      .orderBy('reply.created', 'DESC');
    return paginate<Reply>(gophReplies, options);
  }
}
