import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetPasswordDto } from './dto/set-new-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() data: SignUpCredentialsDto): Promise<void> {
    return this.authService.signUp(data);
  }

  @Post('signin')
  @UsePipes(ValidationPipe)
  signIn(@Body() data: SignInCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(data);
  }

  @Post('reset-password')  
  @UsePipes(ValidationPipe)
  resetPassword(@Body() email: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(email);
  }

  @Post('reset-password-validate')
  @UsePipes(ValidationPipe)
  validateResetPassword(@Body('token') token: string): Promise<{avaliable: boolean}>{
    return this.authService.validateResetToken(token);
  }

  @Post('set-password')
  @UsePipes(ValidationPipe)
  setNewPassword(@Body() setPasswordDto: SetPasswordDto): Promise<void>{
    return this.authService.setNewPassword(setPasswordDto);
  }
}
