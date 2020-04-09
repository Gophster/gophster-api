import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return await this.userRepository.signUp(signUpCredentialsDto);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { handle, email } = await this.userRepository.validateUserPassword(
      signInCredentialsDto,
    );

    if (!handle) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const payload: JwtPayload = { handle, email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
