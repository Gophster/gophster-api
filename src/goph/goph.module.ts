import { UserService } from './../auth/services/user.service';
import { Module } from '@nestjs/common';
import { GophService } from './goph.service';
import { GophController } from './goph.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GophRepository } from './goph.repoistory';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([GophRepository])],
  providers: [GophService],
  controllers: [GophController],
  exports: [GophService],
})
export class GophModule {}
