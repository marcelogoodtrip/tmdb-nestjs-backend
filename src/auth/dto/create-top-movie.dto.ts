export class CreateTopMovieDto {
  readonly id: number;
  readonly title: string;
  readonly popularity: number;
  readonly release_date: string;
  readonly poster_path: string;
  readonly like: number;
}
