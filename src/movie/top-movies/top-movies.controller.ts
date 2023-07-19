import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TopMoviesService } from './top-movies.service';
import { TopMovie } from '../schemas/movie.schema';

@Controller('top-movies')
export class TopMoviesController {
  constructor(private topMoviesService: TopMoviesService) {}

  @Get()
  async getAllMovies(): Promise<TopMovie[]> {
    return this.topMoviesService.getAllMovies();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getMovieById(
    @Param('id')
    id: number,
  ): Promise<TopMovie> {
    return this.topMoviesService.getMovieById(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard())
  likeMovie(@Param('id', ParseIntPipe) id: number) {
    return this.topMoviesService.likeMovie(id);
  }
}
