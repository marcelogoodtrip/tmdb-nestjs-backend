import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopMoviesController } from './top-movies.controller';
import { TopMoviesService } from './top-movies.service';
import { TopMovieSchema } from '../schemas/movie.schema';
import * as cors from 'cors';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'TopMovie', schema: TopMovieSchema }]),
  ],
  controllers: [TopMoviesController],
  providers: [TopMoviesService],
})
export class TopMoviesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('top-movies');
  }
}
