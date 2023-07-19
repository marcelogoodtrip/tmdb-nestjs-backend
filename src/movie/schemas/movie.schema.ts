import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class TopMovie {
  @Prop()
  id: number;

  @Prop()
  title: string;

  @Prop()
  popularity: number;

  @Prop()
  release_date: string;

  @Prop()
  poster_path: string;

  @Prop()
  like: number;
}

export const TopMovieSchema = SchemaFactory.createForClass(TopMovie);
