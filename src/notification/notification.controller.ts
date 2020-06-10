import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Notification } from './notification.entity';
import { ExtractUser } from '../auth/utils/extract-user.docorator';
import { User } from '../auth/entity/user.entity';
import { UserService } from './../auth/services/user.service';
import { NotificationService } from './notification.service';

@Controller('notification')
@UseGuards(AuthGuard())
export class NotificationController {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  showCurrentUserNotifications(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @ExtractUser() user: User,
  ): Promise<Pagination<Notification>> {
    limit = limit > 100 ? 100 : limit;
    return this.notificationService.paginateUserNotifications(
      {
        page,
        limit,
        route: `${process.env.API_URL}/gophs`,
      },
      user,
    );
  }

  @Get('count')
  getUnreadCount(@ExtractUser() user: User): Promise<{ count: number }> {
    return this.notificationService.getUnreadCount(user);
  }

  @Post('read-all')
  readAll(@ExtractUser() user: User) {
    return this.notificationService.readAll(user);
  }
}
