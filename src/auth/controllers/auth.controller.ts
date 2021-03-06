import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';

import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { AuthService } from '../services/auth.service';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';

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
}
