import { Module } from '@nestjs/common';
import { TopMoviesModule } from './modules/top-movies/top-movies.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:root@cluster0.bz4fqpr.mongodb.net/',
    ),
    TopMoviesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
