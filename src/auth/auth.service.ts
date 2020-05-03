import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  BadRequestException,
  ServiceUnavailableException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { User } from './user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NotFoundException } from '@nestjs/common';
import { SendGridService } from '@anchan828/nest-sendgrid';
import * as randomToken from 'random-token';
import { SetPasswordDto } from './dto/set-new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private sendgridService: SendGridService,
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
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    const { email } = data;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException();
    }
    randomToken.create(process.env.RESET_TOKEN_SALT);
    user.resetToken = randomToken(20);
    user.resetTokenExpiration = new Date();
    user.resetTokenExpiration.setHours(user.resetTokenExpiration.getHours() + 2);
    const updatedUser = await user.save();
    if(updatedUser){
      if(await this.sendEmail(user.email,user.resetToken)){
        return;
      };
      throw new ServiceUnavailableException('email could not be sent,Please try again later')
    }
    throw new BadRequestException('could not reset password,please try again later');
  }

  async validateResetToken(token): Promise<{avaliable: boolean}> {
    const user = await this.userRepository.findOne({
      where: {resetToken: token}
    });
    if(!user){
      throw new NotFoundException('Url Not Found');
    }
    if(user.resetTokenExpiration <= new Date){
      return {avaliable: false};
    }

    return {avaliable: true};
  }

  async setNewPassword(setPasswordDto: SetPasswordDto): Promise<void>{
    const user = await this.userRepository.findOne({
      where: {resetToken: setPasswordDto.token}
    });
    if(!user){
      throw new NotFoundException('Url Not Found');
    }
    user.password = setPasswordDto.password;
    await user.hashPasswordAndGenSalt();
    const saveResult = await user.save();
    if(saveResult){
      return;
    }
    else{
      throw new NotAcceptableException();
    }
  }

  async sendEmail(email: string,resetToken: string): Promise<boolean>{
    try{

      await this.sendgridService.send({
        to: email,
        from: 'gophsterdev@gmail.com',
        subject: 'Password Reset',
        text: 'To Reset Password Please proceed to given URL Below: ' + '' + resetToken,
        html: '<strong>To Reset Password Please proceed to given URL Below: </strong><br><a>http://frontend.gophster.localhost/reset-password-validate?token=' + resetToken + '</a>',
      });
      return true;
    }
    catch(error){
      return false;
    }
  }
}
