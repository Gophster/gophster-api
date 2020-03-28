import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class SignUpCredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  handle: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/, {
    message:
      'Your password should contain  uppercase lowrcase letters and nubmer. ',
  })
  password: string;
}
