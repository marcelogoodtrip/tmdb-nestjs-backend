import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as cors from 'cors';
import { AuthModule } from 'src/auth/auth.module';
import { TopRatedService } from './top-rated.service';
import { TopRatedController } from './top-rated.controller';
import { TopMovieSchema } from '../schemas/movie.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'TopMovie', schema: TopMovieSchema }]),
  ],
  controllers: [TopRatedController],
  providers: [TopRatedService],
})
export class TopRatedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('top-rated');
  }
}
