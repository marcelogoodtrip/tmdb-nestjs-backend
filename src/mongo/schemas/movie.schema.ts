import * as mongoose from 'mongoose';

export const TopMovieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  popularity: { type: Number, required: true },
  release_date: { type: String, required: true },
  poster_path: { type: String, required: true },
  like: { type: Number, default: 0 },
});

export interface TopMovie extends mongoose.Document {
  id: number;
  title: string;
  popularity: number;
  release_date: string;
  poster_path: string;
  like: number;
}
