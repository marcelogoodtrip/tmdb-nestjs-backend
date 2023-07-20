import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { TopMovie } from '../schemas/movie.schema';
import { TopRatedService } from './top-rated.service';

describe('TopRatedService', () => {
  let topRatedService: TopRatedService;
  let model: Model<TopMovie>;
  let queryMock: Query<TopMovie[], TopMovie>;

  const mockMovie = {
    id: 569094,
    title: 'Homem-Aranha: Através do Aranhaverso',
    popularity: 1281.799,
    release_date: '2023-05-31',
    poster_path: '/xxPXsL8V95dTwL5vHWIIQALkJQS.jpg',
    like: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopRatedService,
        {
          provide: getModelToken(TopMovie.name),
          useValue: {
            find: jest.fn().mockReturnValue({ sort: jest.fn() }),
          },
        },
      ],
    }).compile();

    topRatedService = module.get<TopRatedService>(TopRatedService);
    model = module.get<Model<TopMovie>>(getModelToken(TopMovie.name));
    queryMock = model.find({}) as Query<TopMovie[], TopMovie>; // Creating a query mock
  });

  describe('getTopRatedMovies', () => {
    it('should fetch top rated movies successfully', async () => {
      jest.spyOn(model, 'find').mockReturnValue(queryMock); // Using the query mock here
      jest.spyOn(queryMock, 'sort').mockReturnValue(queryMock);
      jest.spyOn(queryMock, 'exec').mockResolvedValue([mockMovie]);

      const result = await topRatedService.getTopRatedMovies();

      expect(model.find).toHaveBeenCalledWith({ like: { $gt: 0 } });
      expect(queryMock.sort).toHaveBeenCalledWith({ like: -1 });
      expect(queryMock.exec).toHaveBeenCalled();
      expect(result).toEqual([mockMovie]);
    });

    it('should throw NotFoundException when no top rated movies are found', async () => {
      jest.spyOn(model, 'find').mockReturnValue(queryMock); // Using the query mock here
      jest.spyOn(queryMock, 'sort').mockReturnValue(queryMock);
      jest.spyOn(queryMock, 'exec').mockResolvedValue([]);

      await expect(topRatedService.getTopRatedMovies()).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when fetching top rated movies fails', async () => {
      jest.spyOn(model, 'find').mockReturnValue(queryMock); // Using the query mock here
      jest.spyOn(queryMock, 'sort').mockReturnValue(queryMock);
      jest.spyOn(queryMock, 'exec').mockRejectedValue(new Error());

      await expect(topRatedService.getTopRatedMovies()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
