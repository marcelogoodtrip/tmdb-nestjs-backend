import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { TopMovie } from '../schemas/movie.schema';
import { TopMoviesService } from './top-movies.service';

describe('TopMoviesService', () => {
  let topMoviesService: TopMoviesService;
  let model: Model<TopMovie>;

  const mockMovie = {
    id: 569094,
    title: 'Homem-Aranha: Através do Aranhaverso',
    popularity: 1281.799,
    release_date: '2023-05-31',
    poster_path: '/xxPXsL8V95dTwL5vHWIIQALkJQS.jpg',
    like: 2,
  };

  const mockMovieService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopMoviesService,
        {
          provide: getModelToken(TopMovie.name),
          useValue: mockMovieService,
        },
      ],
    }).compile();

    topMoviesService = module.get<TopMoviesService>(TopMoviesService);
    model = module.get<Model<TopMovie>>(getModelToken(TopMovie.name));
  });

  describe('getAllMovies', () => {
    it('should fetch all movies successfully', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockMovie]);

      const result = await topMoviesService.getAllMovies();

      expect(model.find).toHaveBeenCalled();
      expect(result).toEqual([mockMovie]);
    });

    it('should throw InternalServerErrorException when fetching all movies fails', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([]);

      await expect(topMoviesService.getAllMovies()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getMovieById', () => {
    const movieId = 1;
    const mockMovie = { id: movieId, name: 'Movie 1', like: 10 };

    it('should fetch a movie by id successfully', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockMovie);

      const result = await topMoviesService.getMovieById(movieId);

      expect(model.findOne).toHaveBeenCalledWith({ id: movieId });
      expect(result).toEqual(mockMovie);
    });

    it('should throw InternalServerErrorException when fetching a movie by id fails', async () => {
      jest.spyOn(model, 'findOne').mockRejectedValue(new Error());

      await expect(topMoviesService.getMovieById(movieId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw NotFoundException when movie not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);

      await expect(topMoviesService.getMovieById(movieId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when movieId is not a number', async () => {
      await expect(topMoviesService.getMovieById(NaN)).rejects.toThrow(
        NotFoundException,
      );
      await expect(topMoviesService.getMovieById(0)).rejects.toThrow(
        NotFoundException,
      );
      await expect(topMoviesService.getMovieById(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('likeMovie', () => {
    const movieId = 1;
    const mockMovie = { id: movieId, name: 'Movie 1', like: 10 };

    it('should update like count for a movie successfully', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(mockMovie);

      const result = await topMoviesService.likeMovie(movieId);

      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { id: movieId },
        { $inc: { like: 1 } },
        { new: true },
      );
      expect(result).toEqual(mockMovie);
    });

    it('should throw InternalServerErrorException when updating like count fails', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockRejectedValue(new Error());

      await expect(topMoviesService.likeMovie(movieId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw NotFoundException when movie to like is not found', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(null);

      await expect(topMoviesService.likeMovie(movieId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when movieId is not a number', async () => {
      await expect(topMoviesService.likeMovie(NaN)).rejects.toThrow(
        NotFoundException,
      );
      await expect(topMoviesService.likeMovie(0)).rejects.toThrow(
        NotFoundException,
      );
      await expect(topMoviesService.likeMovie(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
