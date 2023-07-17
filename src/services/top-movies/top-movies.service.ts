import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopMovie } from 'src/mongo/schemas/movie.schema';

@Injectable()
export class TopMoviesService {
  constructor(
    @InjectModel('TopMovie') private readonly topMovieModel: Model<TopMovie>,
  ) {}

  async getMovie(id: number): Promise<TopMovie> {
    return this.topMovieModel.findOne({ id });
  }

  async likeMovie(id: number): Promise<TopMovie> {
    return this.topMovieModel.findOneAndUpdate(
      { id },
      { $inc: { like: 1 } },
      { new: true },
    );
  }

  // async getTopRatedMovies(): Promise<TopMovie[]> {
  //   return this.topMovieModel
  //     .aggregate([
  //       {
  //         $match: {
  //           like: { $gt: 0 },
  //         },
  //       },
  //       {
  //         $sort: {
  //           like: -1,
  //         },
  //       },
  //     ])
  //     .exec();
  // }

  async getTopRatedMovies(): Promise<TopMovie[]> {
    return this.topMovieModel.find().sort({ like: -1 }).exec();
  }
}
