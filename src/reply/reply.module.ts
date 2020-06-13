import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyRepository } from './reply.repository';
import { GophModule } from 'src/goph/goph.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ReplyRepository]),
    GophModule,
  ],
  providers: [ReplyService],
  controllers: [ReplyController],
})
export class ReplyModule {}
