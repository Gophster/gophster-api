import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class GophDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(290)
  text: string;
}
