import { Message } from './messenger.entity';
import { MessengerService } from './messenger.service';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  ParseUUIDPipe,
  Query,
  Post,
} from '@nestjs/common';
import { ExtractUser } from '../auth/utils/extract-user.docorator';
import { User } from '../auth/entity/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('messenger')
@UseGuards(AuthGuard())
export class MessengerController {
  constructor(private messengerService: MessengerService) {}

  @Get('conversation/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getConversation(
    @Param('id', new ParseUUIDPipe()) id: string,
    @ExtractUser() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Message>> {
    return this.messengerService.getUserConversation(user, id, {
      page,
      limit,
      route: `${process.env.API_URL}/messenger/conversation/${id}`,
    });
  }

  @Get('count')
  async getUnreadyMessagesCount(
    @ExtractUser() user: User,
  ): Promise<{ count: number }> {
    return this.messengerService.getUnreadCount(user);
  }

  @Post('read-all')
  async readAll(@ExtractUser() user: User): Promise<{ success: boolean }> {
    return this.messengerService.read(user);
  }

  @Post('read/:id')
  async readConversation(
    @ExtractUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ success: boolean }> {
    return this.messengerService.read(user, id);
  }
}
