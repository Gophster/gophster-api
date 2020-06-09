import { UserService } from './../auth/services/user.service';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ValidationPipe,
  ParseUUIDPipe,
  Delete,
  Query,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GophDto } from './dto/goph.dto';
import { ExtractUser } from 'src/auth/utils/extract-user.docorator';
import { GophService } from './goph.service';
import { User } from 'src/auth/entity/user.entity';
import { Goph } from './goph.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('gophs')
@UseGuards(AuthGuard())
export class GophController {
  constructor(
    private gophService: GophService,
    private userService: UserService,
  ) {}

  @Get('feed')
  @UseInterceptors(ClassSerializerInterceptor)
  async getnewsfeed(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @ExtractUser() user: User,
  ): Promise<Pagination<Goph>> {
    limit = limit > 100 ? 100 : limit;

    return this.gophService.paginateNewsFeedGophs(
      {
        page,
        limit,
        route: `${process.env.API_URL}/gophs/feed`,
      },
      user,
    );
  }

  @Post('')
  createGoph(
    @Body(new ValidationPipe()) goph: GophDto,
    @ExtractUser() user: User,
  ): Promise<Goph> {
    return this.gophService.createGoph(goph, user);
  }

  @Get(':id')
  showSingleGoph(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.gophService.getSinlgeGophById(id);
  }

  @Patch(':id')
  patchGoph(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) goph: GophDto,
    @ExtractUser() user: User,
  ): Promise<Goph> {
    return this.gophService.patchGoph(id, goph, user);
  }

  @Delete(':id')
  deleteGoph(
    @Param('id', new ParseUUIDPipe()) id: string,
    @ExtractUser() user: User,
  ) {
    return this.gophService.deleteGoph(id, user);
  }

  @Get('user/:handle')
  async getUserGophs(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('handle') handle: string,
  ): Promise<Pagination<Goph>> {
    limit = limit > 100 ? 100 : limit;
    const user = await this.userService.userRepository.findOne({
      where: { handle },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return this.gophService.paginateUserGophs(
      {
        page,
        limit,
        route: `${process.env.API_URL}/gophs/user/${handle}`,
      },
      user,
    );
  }
}
