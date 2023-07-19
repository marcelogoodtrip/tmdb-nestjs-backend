import { Controller, Get } from '@nestjs/common';
import { TopMovie } from 'src/movie/schemas/movie.schema';
import { TopRatedService } from './top-rated.service';

@Controller('top-rated')
export class TopRatedController {
  constructor(private topRatedService: TopRatedService) {}

  @Get()
  async getTopRatedMovies(): Promise<TopMovie[]> {
    return this.topRatedService.getTopRatedMovies();
  }
}
