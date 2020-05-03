import { MinLength, MaxLength, IsString } from 'class-validator';

export class FollowDto {
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  handle: string;
}
