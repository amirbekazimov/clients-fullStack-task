import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { UsersEntity } from './users/users.entity';

import * as dotenv from 'dotenv';

dotenv.config();

const pg = new URL(process.env.APP_PG_URL);

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: pg.hostname,
      port: parseInt(pg.port),
      entities: ['dist/**/*.entity{.ts,.js}'],
      username: pg.username,
      password: pg.password,
      database: pg.pathname.slice(1),
      ssl: pg.searchParams.get('sslmode') !== 'disable',
      autoLoadEntities: true,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      useUTC: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
