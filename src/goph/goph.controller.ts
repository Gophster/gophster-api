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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GophDto } from './dto/goph.dto';
import { ExtractUser } from 'src/auth/extract-user.docorator';
import { GophService } from './goph.service';
import { User } from 'src/auth/user.entity';
import { Goph } from './goph.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('gophs')
@UseGuards(AuthGuard())
export class GophController {
  constructor(private gophService: GophService) {}

  @Get('')
  showUserGophs(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @ExtractUser() user: User,
  ): Promise<Pagination<Goph>> {
    limit = limit > 100 ? 100 : limit;
    return this.gophService.paginateUserGophs(
      {
        page,
        limit,
        route: `${process.env.API_URL}/gophs`,
      },
      user,
    );
  }

  @Post()
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
}
