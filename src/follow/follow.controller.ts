import { Follow } from './follow.entity';
import { User } from 'src/auth/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './../auth/services/user.service';
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Param,
} from '@nestjs/common';

import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { ExtractUser } from './../auth/utils/extract-user.docorator';

@Controller('actions')
@UseGuards(AuthGuard())
export class FollowController {
  constructor(
    private followService: FollowService,
    private userService: UserService,
  ) {}

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
  ): Promise<{ data: boolean }> {
    return this.followService.isFollowing(data.handle, user);
  }

  @Get('suggestions')
  @UseInterceptors(ClassSerializerInterceptor)
  async suggestions(@ExtractUser() user: User): Promise<User[]> {
    return this.followService.suggestions(user);
  }

  @Get('followers/:handle')
  @UseInterceptors(ClassSerializerInterceptor)
  async followers(
    @ExtractUser() user: User,
    @Param('handle') handle: string,
    ): Promise<User[]> {
    return this.followService.getFollowers(user,handle);
  }

  @Get('following/:handle')
  @UseInterceptors(ClassSerializerInterceptor)
  async following(
    @ExtractUser() user: User,
    @Param('handle') handle: string,
    ): Promise<User[]> {
    return this.followService.getFollowings(user,handle);
  }
}
