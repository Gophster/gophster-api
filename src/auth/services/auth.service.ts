import {
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../entity/user.repository';
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userData: SignUpCredentialsDto): Promise<void> {
    const { handle, email } = userData;
    const userExsists = await this.userRepository.findOne({
      where: [{ handle: handle }, { email: email }],
    });

    if (userExsists) {
      throw new HttpException('User already exsits', 409);
    }

    const user = await this.userRepository.create(userData);
    await user.save();
  }

  async signIn(
    userData: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { login, password } = userData;

    const user = await this.userRepository.findOne({
      where: [{ handle: login }, { email: login }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    if (!(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    return this.generateToken(user);
  }

  async generateToken(user: User): Promise<{ accessToken: string }> {
    const payload: JwtPayload = {
      uuid: user.id,
      handle: user.handle,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      location: user.location,
      birthdate: user.birthdate,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }
}
