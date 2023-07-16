import { Module } from '@nestjs/common';
import { TopMoviesController } from './controllers/top-movies/top-movies.controller';

@Module({
  imports: [],
  controllers: [TopMoviesController],
  providers: [],
})
export class AppModule {}
