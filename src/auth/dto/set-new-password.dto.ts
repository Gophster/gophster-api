import { IsString, MinLength, MaxLength, Matches} from 'class-validator';

export class SetPasswordDto {
    @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/, {
    message:
      'Your password should contain  uppercase lowrcase letters and nubmer. ',
  })
  password: string;

  token: string;
}