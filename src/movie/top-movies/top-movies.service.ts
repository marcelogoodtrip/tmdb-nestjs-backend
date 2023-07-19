import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopMovie } from '../schemas/movie.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class TopMoviesService {
  constructor(
    @InjectModel(TopMovie.name)
    private topMovieModel: mongoose.Model<TopMovie>,
  ) {}

  async getAllMovies(): Promise<TopMovie[]> {
    try {
      const movies = await this.topMovieModel.find().exec();
      if (!movies || movies.length === 0) {
        throw new NotFoundException('No movies found.');
      }
      return movies;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while fetching all movies.',
      );
    }
  }

  async getMovieById(id: number): Promise<TopMovie> {
    if (isNaN(id) || id <= 0) {
      throw new NotFoundException('Invalid movie ID.');
    }
    try {
      const movie = await this.topMovieModel.findOne({ id }).exec();
      if (!movie) {
        throw new NotFoundException('Movie not found.');
      }
      return movie;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while fetching the movie.',
      );
    }
  }

  async likeMovie(id: number): Promise<TopMovie> {
    if (isNaN(id) || id <= 0) {
      throw new NotFoundException('Invalid movie ID.');
    }
    try {
      const movie = await this.topMovieModel
        .findOneAndUpdate({ id }, { $inc: { like: 1 } }, { new: true })
        .exec();
      if (!movie) {
        throw new NotFoundException('Movie not found.');
      }
      return movie;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while updating the like count.',
      );
    }
  }
}
