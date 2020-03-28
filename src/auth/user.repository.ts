import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const { email, handle, password } = signUpCredentialsDto;

    const user = new User();
    user.email = email;
    user.handle = handle;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Username: ${handle} already exists.`);
      }

      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<User> {
    const { login, password } = signInCredentialsDto;
    const user = await this.findOne({
      where: [{ handle: login }, { email: login }],
    });

    if (user && (await user.validatePassword(password))) {
      return user;
    }

    throw new UnauthorizedException();
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
