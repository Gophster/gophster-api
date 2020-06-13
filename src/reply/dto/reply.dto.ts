import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ReplyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(290)
  text: string;
  @IsString()
  @IsNotEmpty()
  goph: string;
}
