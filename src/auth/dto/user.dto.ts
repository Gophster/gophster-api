import {
  IsString,
  MinLength,
  MaxLength,
  IsDate,
  IsOptional,
} from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  location: string;

  @IsOptional()
  @IsDate()
  birthdate: Date;
}
