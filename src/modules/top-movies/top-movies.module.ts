import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopMoviesController } from 'src/controllers/top-movies/top-movies.controller';
import { TopMovieSchema } from 'src/mongo/schemas/movie.schema';
import { TopMoviesService } from 'src/services/top-movies/top-movies.service';
import * as cors from 'cors';

@Module({
  imports: [
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
