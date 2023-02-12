export default class MovieService {
  _apiKeyV4 = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDIzOGRhMjMxYjAxYTliYTkzNTZjOWM3YzNiMjU1YyIsInN1YiI6IjYzZDRkYzFlYzE1YjU1MDA3OWZhNTZiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._gKrfSk99HVRpMoJEoAURaAFZPiPF_88XHkN34jP34s`;

  _apiKeyV3 = `50238da231b01a9ba9356c9c7c3b255c`;

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
    const posterPath = data.poster_path
      ? `https://image.tmdb.org/t/p/original${data.poster_path}`
      : '';

    const avgRating = Number.isInteger(data.vote_average)
      ? `${data.vote_average}.0`
      : Math.round(data.vote_average * 10) / 10;

    const userRating =
      data.rating || JSON.parse(localStorage.getItem('ratedMovies'))[data.id];

    return {
      id: data.id,
      title: data.title,
      avgRating,
      userRating,
      posterPath,
      releaseDate: data.release_date,
      overview: data.overview,
      genreId: data.genre_ids,
    };
  }

  async createGuestSession() {
    const response = await fetch(
      `${this._apiBase}/authentication/guest_session/new`,
      {
        headers: {
          Authorization: `Bearer ${this._apiKeyV4}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: Request status ${response.status}`);
    }

    const data = await response.json();

    return data.success
      ? data
      : new Error(`Error: failed create guest session}`);
  }

  async putGuestRating(movieId, guestSessionId, rating) {
    const response = await fetch(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${this._apiKeyV3}&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: +rating }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: Request status ${response.status}`);
    }
  }

  async getRatedMovies(guestSessionID, page = 1) {
    const response = await fetch(
      `${this._apiBase}/guest_session/${guestSessionID}/rated/movies?api_key=${this._apiKeyV3}&page=${page}`,
      {
        headers: {
          'Content-type': 'application/json;charset=utf-8',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: Request status ${response.status}`);
    }

    const result = await response.json();

    return MovieService.transformMoviesData(result);
  }

  async getData(endpoint, query = '', page = 1) {
    const response = await fetch(
      `${this._apiBase}${endpoint}?query=${query}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${this._apiKeyV4}`,
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

  async getFoundMovies(query, page) {
    const result = await this.getData('/search/movie', query, page);
    return MovieService.transformMoviesData(result);
  }

  async getPopularMovies(page) {
    const result = await this.getData('/movie/popular', '', page);
    return MovieService.transformMoviesData(result);
  }

  async getGenresMovies() {
    const result = await this.getData('/genre/movie/list');

    return result.genres.reduce((obj, item) => {
      obj[item.id] = item.name;
      return obj;
    }, {});
  }
}
