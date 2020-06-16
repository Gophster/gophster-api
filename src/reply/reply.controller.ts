import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Get,
  Param,
  Post,
  Body,
  ValidationPipe,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ExtractUser } from 'src/auth/utils/extract-user.docorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Reply } from './reply.entity';
import { User } from 'src/auth/entity/user.entity';
import { ReplyService } from './reply.service';
import { ReplyDto } from './dto/reply.dto';

@Controller('reply')
@UseGuards(AuthGuard())
export class ReplyController {
  constructor(private replyService: ReplyService) {}

  @Get(':gophId')
  @UseInterceptors(ClassSerializerInterceptor)
  async getGophReplies(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('gophId') gophIdentificator: string,
  ): Promise<Pagination<Reply>> {
    limit = limit > 100 ? 100 : limit;
    return this.replyService.paginateGophReplies(
      {
        page,
        limit,
        route: `${process.env.API_URL}/reply/${gophIdentificator}`,
      },
      gophIdentificator,
    );
  }

  @Post('')
  @UseInterceptors(ClassSerializerInterceptor)
  createReply(
    @Body(new ValidationPipe()) reply: ReplyDto,
    @ExtractUser() user: User,
  ): Promise<Reply> {
    return this.replyService.createReply(reply, user);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  showSingleReply(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Reply> {
    return this.replyService.getSingleReplyById(id);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  patchReply(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) reply: ReplyDto,
    @ExtractUser() user: User,
  ): Promise<Reply> {
    return this.replyService.patchReply(id, reply, user);
  }

  @Delete(':id')
  deleteReply(@Param('id', new ParseUUIDPipe()) id: string): Promise<Reply> {
    return this.replyService.deleteReply(id);
  }
}
