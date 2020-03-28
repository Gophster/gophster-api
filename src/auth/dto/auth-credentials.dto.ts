import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/, {
    message:
      'Your password should contain  uppercase lowrcase letters and nubmer. ',
  })
  password: string;
}
