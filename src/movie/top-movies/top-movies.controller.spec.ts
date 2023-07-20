import { Test, TestingModule } from '@nestjs/testing';
import { TopMoviesController } from './top-movies.controller';
import { TopMoviesService } from './top-movies.service';
import { AuthService } from '../../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { TopMovie } from '../schemas/movie.schema';

describe('TopMoviesController', () => {
  let controller: TopMoviesController;
  let service: TopMoviesService;
  let authService: AuthService;

  const mockMovie: TopMovie = {
    id: 1,
    title: 'Mock Movie',
    popularity: 100,
    release_date: '2023-01-01',
    poster_path: '/mock-poster.jpg',
    like: 0,
  };

  const mockRequest = {
    headers: {
      authorization: 'Bearer mock-token',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopMoviesController],
      providers: [
        {
          provide: TopMoviesService,
          useValue: {
            getAllMovies: jest.fn().mockResolvedValue([mockMovie]),
            getMovieById: jest.fn().mockResolvedValue(mockMovie),
            likeMovie: jest.fn().mockResolvedValue(mockMovie),
          },
        },
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<TopMoviesController>(TopMoviesController);
    service = module.get<TopMoviesService>(TopMoviesService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllMovies', () => {
    it('should return an array of movies', async () => {
      const result = await controller.getAllMovies();
      expect(result).toEqual([mockMovie]);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by id', async () => {
      const id = 1;
      const result = await controller.getMovieById(id);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('likeMovie', () => {
    it('should call topMoviesService.likeMovie with correct id', async () => {
      const id = 1;
      const spyLikeMovie = jest.spyOn(service, 'likeMovie');

      await controller.likeMovie(id, mockRequest as any);

      expect(spyLikeMovie).toHaveBeenCalledWith(id);
    });

    it('should throw UnauthorizedException if user is not logged in', async () => {
      jest.spyOn(authService, 'isLoggedIn').mockReturnValue(false);

      await expect(controller.likeMovie(1, mockRequest as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return the liked movie', async () => {
      const id = 1;
      const result = await controller.likeMovie(id, mockRequest as any);
      expect(result).toEqual(mockMovie);
    });
  });
});
