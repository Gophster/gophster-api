import { Follow } from './follow.entity';
import { User } from 'src/auth/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Get,
} from '@nestjs/common';

import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { ExtractUser } from './../auth/utils/extract-user.docorator';

@Controller('actions')
@UseGuards(AuthGuard())
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post('follow')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async follow(
    @Body() data: FollowDto,
    @ExtractUser() user: User,
  ): Promise<Follow> {
    return this.followService.createFollow(data.handle, user);
  }

  @Post('unfollow')
  @HttpCode(202)
  async unfollow(
    @Body() data: FollowDto,
    @ExtractUser() user: User,
  ): Promise<void> {
    return this.followService.removeFollow(data.handle, user);
  }

  @Post('isfollowing')
  @UseInterceptors(ClassSerializerInterceptor)
  async isfollowing(
    @Body() data: FollowDto,
    @ExtractUser() user: User,
  ): Promise<{ data: boolean}>{
    return this.followService.isFollowing(data.handle,user);
  }


}
