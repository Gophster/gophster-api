import { IsEmail } from 'class-validator';

export class RessetPasswordDto {
  @IsEmail()
  email: string;
}
