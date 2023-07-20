import { Test, TestingModule } from '@nestjs/testing';
import { TopRatedController } from './top-rated.controller';
import { TopRatedService } from './top-rated.service';
import { TopMovie } from '../schemas/movie.schema';

describe('TopRatedController', () => {
  let controller: TopRatedController;
  let service: TopRatedService;

  const mockMovie: TopMovie = {
    id: 1,
    title: 'Mock Movie',
    popularity: 100,
    release_date: '2023-01-01',
    poster_path: '/mock-poster.jpg',
    like: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopRatedController],
      providers: [
        {
          provide: TopRatedService,
          useValue: {
            getTopRatedMovies: jest.fn().mockResolvedValue([mockMovie]),
          },
        },
      ],
    }).compile();

    controller = module.get<TopRatedController>(TopRatedController);
    service = module.get<TopRatedService>(TopRatedService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTopRatedMovies', () => {
    it('should return an array of top rated movies', async () => {
      const result = await controller.getTopRatedMovies();
      expect(result).toEqual([mockMovie]);
    });
  });
});
