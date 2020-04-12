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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GophDto } from './dto/goph.dto';
import { ExtractUser } from 'src/auth/extract-user.docorator';
import { GophService } from './goph.service';
import { User } from 'src/auth/user.entity';
import { Goph } from './goph.entity';

@Controller('gophs')
@UseGuards(AuthGuard())
export class GophController {
  constructor(private gophService: GophService) {}

  @Post()
  createGoph(
    @Body(new ValidationPipe()) goph: GophDto,
    @ExtractUser() user: User,
  ): Promise<Goph> {
    return this.gophService.createGoph(goph, user);
  }

  @Get()
  showGophs(@ExtractUser() user: User): Promise<Goph[]> {
    return this.gophService.getGophsForUser(user);
  }

  @Get(':id')
  showSingleGoph(@Param('id', new ParseUUIDPipe()) id: string,){
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
