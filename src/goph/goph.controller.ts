import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
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
  createGoph(@Body() data: GophDto, @ExtractUser() user: User): Promise<Goph> {
    return this.gophService.createGoph(data, user);
  }

  @Get()
  showGophs(@ExtractUser() user: User): Promise<Goph[]> {
    return this.gophService.getGophsForUser(user);
  }
}
