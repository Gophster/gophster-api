import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeOrmConfig from 'config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GophModule } from './goph/goph.module';
import { SendGridModule } from '@anchan828/nest-sendgrid';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
    ConfigModule.forRoot(),
    AuthModule,
    GophModule,
  ],
  exports: [SendGridModule],
})
export class AppModule {}
