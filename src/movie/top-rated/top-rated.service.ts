import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';
import { TopMovie } from '../schemas/movie.schema';

@Injectable()
export class TopRatedService {
  constructor(
    @InjectModel(TopMovie.name)
    private topRatedModel: mongoose.Model<TopMovie>,
  ) {}

  async getTopRatedMovies(): Promise<TopMovie[]> {
    try {
      const rated_movies = await this.topRatedModel
        .find({ like: { $gt: 0 } })
        .sort({ like: -1 })
        .exec();

      if (!rated_movies || rated_movies.length === 0) {
        throw new NotFoundException('No movies with likes found.');
      }

      return rated_movies;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while fetching top rated movies.',
      );
    }
  }
}
