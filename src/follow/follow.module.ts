import { UserRepository } from './../auth/entity/user.repository';
import { AuthModule } from './../auth/auth.module';
import { FollowRepository } from './follow.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FollowRepository])],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
