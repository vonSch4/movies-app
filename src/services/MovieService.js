export default class MovieService {
  _apiKey = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDIzOGRhMjMxYjAxYTliYTkzNTZjOWM3YzNiMjU1YyIsInN1YiI6IjYzZDRkYzFlYzE1YjU1MDA3OWZhNTZiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._gKrfSk99HVRpMoJEoAURaAFZPiPF_88XHkN34jP34s`;

  _apiBase = `https://api.themoviedb.org/3`;

  static transformMoviesData(movie) {
    return {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      overview: movie.overview,
    };
  }

  async getData(endpoint, query) {
    const response = await fetch(`${this._apiBase}${endpoint}?query=${query}`, {
      headers: {
        Authorization: `Bearer ${this._apiKey}`,
        'Content-type': 'application/json;charset=utf-8',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: Request status ${response.status}`);
    }

    const data = await response.json();

    return data;
  }

  async getMovies(query) {
    const result = await this.getData('/search/movie', query);
    return result.results.map(MovieService.transformMoviesData);
  }
}
