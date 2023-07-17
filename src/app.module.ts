import { Module } from '@nestjs/common';
import { TopMoviesModule } from './modules/top-movies/top-movies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    TopMoviesModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
