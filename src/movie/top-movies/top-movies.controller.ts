import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Request,
  UnauthorizedException,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TopMoviesService } from './top-movies.service';
import { TopMovie } from '../schemas/movie.schema';
import { AuthService } from 'src/auth/auth.service';
import { CreateTopMovieDto } from '../dto/create-top-movie.dto';

@Controller('top-movies')
export class TopMoviesController {
  constructor(
    private topMoviesService: TopMoviesService,
    private authService: AuthService,
  ) {}

  @Get()
  async getAllMovies(): Promise<TopMovie[]> {
    return this.topMoviesService.getAllMovies();
  }

  @Post('save-top-movie')
  async saveTopMovie(@Body() movie: CreateTopMovieDto): Promise<TopMovie> {
    return this.topMoviesService.saveTopMovie(movie);
  }

  @Get(':id')
  async getMovieById(
    @Param('id')
    id: number,
  ): Promise<TopMovie> {
    return this.topMoviesService.getMovieById(id);
  }

  @Post(':id/like')
  //@UseGuards(AuthGuard())
  async likeMovie(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: Request,
  ) {
    const isUserLoggedIn = this.authService.isLoggedIn(request);
    if (!isUserLoggedIn) {
      throw new UnauthorizedException('Login first to like a movie.');
    }

    return this.topMoviesService.likeMovie(id);
  }
}
