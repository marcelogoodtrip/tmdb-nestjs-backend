import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TopMoviesModule } from './movie/top-movies/top-movies.module';
import { TopRatedModule } from './movie/top-rated/top-rated.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    TopMoviesModule,
    TopRatedModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
