import { FollowSubscriber } from './../src/auth/subscribers/follow-system.subscriber';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [`${__dirname}/../**/*.entity.{js,ts}`],
  subscribers: [`${__dirname}/../**/*.subscriber.{js,ts}`],
  synchronize: false,
  logging: true,
  migrations: [`${__dirname}/../src/migrations/**/*{.ts,.js}`],
  cli: {
    migrationsDir: `src/migrations`,
  },
};

export = typeOrmConfig;
