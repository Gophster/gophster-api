import {
  Controller,
  Post,
  Header,
  UseGuards,
  Body,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { UserDto } from '../dto/user.dto';
import { filterImageFormats, suffixFile } from '../utils/file-utils';
import { User } from '../entity/user.entity';
import { UserService } from '../services/user.service';
import { ExtractUser } from '../utils/extract-user.docorator';

import * as path from 'path';
import * as fs from 'fs';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('profile')
  @Header('Accept', 'multipart/form-data')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'assets/files/avatars'),
        filename: suffixFile,
      }),
      fileFilter: filterImageFormats,
      limits: {
        fileSize: 2097152, //2MB
      },
    }),
  )
  async updateProfile(
    @Body(new ValidationPipe()) data: UserDto,
    @UploadedFile() avatar,
    @ExtractUser() user,
  ): Promise<Partial<User>> {
    return this.userService.updateUser(data, avatar, user);
  }

  @Get(':handle')
  @UseGuards(AuthGuard())
  async userProfile(@Param('handle') handle): Promise<Partial<User>> {
    return this.userService.getUserByHandle(handle);
  }

  @Get('avatars/:image')
  async serveAvatar(@Param('image') fileId, @Res() res): Promise<any> {
    if (
      fs.existsSync(path.join(process.cwd(), `assets/files/avatars/${fileId}`))
    ) {
      res.sendFile(fileId, {
        root: path.join(process.cwd(), 'assets/files/avatars'),
      });
    } else {
      res.sendFile(fileId, {
        root: path.join(process.cwd(), 'assets/defaults'),
      });
    }
  }
}
