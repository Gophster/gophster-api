import { Follow } from './follow.entity';
import { User } from 'src/auth/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './../auth/services/user.service';
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { ExtractUser } from './../auth/utils/extract-user.docorator';
import { Goph } from 'src/goph/goph.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

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
  async suggestions(@ExtractUser() user: User): Promise<User[]> {
    return this.followService.suggestions(user);
  }

  @Get('newsfeed')
  async getnewsfeed(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @ExtractUser() user: User,
  ): Promise<Pagination<Goph>> {
    limit = limit > 100 ? 100 : limit;
    const users = await this.userService.userRepository.findOne({
      where: { handle: user.handle },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return this.followService.paginateNewsFeedGophs(
      {
        page,
        limit,
        route: `${process.env.API_URL}/actions/follow/${user.handle}`,
      },
      user,
    );
  }
}
