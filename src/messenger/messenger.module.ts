import { MessengerGateway } from './messenger.gateway';
import { AuthModule } from './../auth/auth.module';
import { MessengerRepository } from './messenger.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MessengerRepository]), AuthModule],
  providers: [
    MessengerService,
    MessengerGateway,
  ],
  controllers: [MessengerController],
})
export class MessengerModule {}
