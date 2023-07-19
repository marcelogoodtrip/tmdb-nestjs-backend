import { Test, TestingModule } from '@nestjs/testing';
import { TopMoviesService } from './top-movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { TopMovie } from '../schemas/movie.schema';
import { Model } from 'mongoose';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('TopMoviesService', () => {
  let topMoviesService: TopMoviesService;
  let model: Model<TopMovie>;

  const mockTopMoviesService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopMoviesService,
        {
          provide: getModelToken(TopMovie.name),
          useValue: mockTopMoviesService,
        },
      ],
    }).compile();

    topMoviesService = module.get<TopMoviesService>(TopMoviesService);
    model = module.get<Model<TopMovie>>(getModelToken(TopMovie.name));
  });

  describe('getAllMovies', () => {
    it('should fetch all movies successfully', async () => {
      const mockMovies = [
        { id: 1, name: 'Movie 1' },
        { id: 2, name: 'Movie 2' },
      ];
      jest.spyOn(model, 'find').mockResolvedValueOnce(mockMovies);
      const result = await topMoviesService.getAllMovies();
      expect(result).toEqual(mockMovies);
    });

    it('should throw InternalServerErrorException when fetching all movies fails', async () => {
      jest.spyOn(model, 'find').mockRejectedValueOnce(new Error());

      try {
        await topMoviesService.getAllMovies();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          'Something went wrong while fetching all movies.',
        );
      }
    });
  });

  describe('getMovieById', () => {
    it('should fetch a movie by id successfully', async () => {
      const movieId = 1;
      const mockMovie = { id: movieId, name: 'Movie 1' };
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockMovie);
      const result = await topMoviesService.getMovieById(movieId);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie not found', async () => {
      const movieId = 1;
      jest.spyOn(model, 'findOne').mockReturnValueOnce(null);

      try {
        await topMoviesService.getMovieById(movieId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie not found.');
      }
    });

    it('should throw InternalServerErrorException when fetching a movie by id fails', async () => {
      const movieId = 1;
      jest.spyOn(model, 'findOne').mockRejectedValueOnce(new Error());

      try {
        await topMoviesService.getMovieById(movieId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          'Something went wrong while fetching the movie.',
        );
      }
    });
  });

  describe('likeMovie', () => {
    it('should update like count for a movie successfully', async () => {
      const movieId = 1;
      const mockMovie = { id: movieId, name: 'Movie 1', like: 5 };
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValueOnce(mockMovie);
      const result = await topMoviesService.likeMovie(movieId);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie to like is not found', async () => {
      const movieId = 1;
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce(null);

      try {
        await topMoviesService.likeMovie(movieId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie not found.');
      }
    });

    it('should throw InternalServerErrorException when updating like count fails', async () => {
      const movieId = 1;
      jest.spyOn(model, 'findOneAndUpdate').mockRejectedValueOnce(new Error());

      try {
        await topMoviesService.likeMovie(movieId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          'Something went wrong while updating the like count.',
        );
      }
    });
  });
});
