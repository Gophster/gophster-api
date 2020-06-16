import { Module } from '@nestjs/common';
import { GophService } from './goph.service';
import { GophController } from './goph.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GophRepository } from './goph.repoistory';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([GophRepository]),
    BullModule.registerQueue({
      name: 'notification',
      redis: {
        host: 'gophster.redis',
        port: 6379,
      },
    }),
  ],
  providers: [GophService],
  controllers: [GophController],
})
export class GophModule {}
