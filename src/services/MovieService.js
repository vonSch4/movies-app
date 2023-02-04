export default class MovieService {
  _apiKey = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDIzOGRhMjMxYjAxYTliYTkzNTZjOWM3YzNiMjU1YyIsInN1YiI6IjYzZDRkYzFlYzE1YjU1MDA3OWZhNTZiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._gKrfSk99HVRpMoJEoAURaAFZPiPF_88XHkN34jP34s`;

  _apiBase = `https://api.themoviedb.org/3`;

  static transformMoviesData(data) {
    const {
      page,
      results,
      total_pages: totalPages,
      total_results: totalResults,
    } = data;

    return {
      page,
      results: results.map(MovieService.transformResultsData),
      totalPages: totalPages >= 500 ? 500 : totalPages,
      totalResults: totalResults >= 10000 ? 10000 : totalResults,
    };
  }

  static transformResultsData(data) {
    return {
      id: data.id,
      title: data.title,
      posterPath: data.poster_path,
      releaseDate: data.release_date,
      overview: data.overview,
    };
  }

  async getData(endpoint, query = '', page = 1) {
    const response = await fetch(
      `${this._apiBase}${endpoint}?query=${query}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${this._apiKey}`,
          'Content-type': 'application/json;charset=utf-8',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: Request status ${response.status}`);
    }

    const data = await response.json();

    return data;
  }

  async getMovies(query, page) {
    const result = await this.getData('/search/movie', query, page);
    return MovieService.transformMoviesData(result);
  }

  async getPopularMovies(page) {
    const result = await this.getData('/movie/popular', '', page);
    return MovieService.transformMoviesData(result);
  }
}
