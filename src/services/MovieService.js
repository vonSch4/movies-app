class MovieService {
  _apiBase = `https://api.themoviedb.org/3`;

  async createGuestSession() {
    const response = await fetch(
      `${this._apiBase}/authentication/guest_session/new`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY_V4}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: Request status ${response.status}`);
    }

    const data = await response.json();

    return data.success
      ? data
      : new Error(`Error: failed create guest session`);
  }

  async putGuestRating(movieId, guestSessionId, rating) {
    const response = await fetch(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${process.env.REACT_APP_API_KEY_V3}&guest_session_id=${guestSessionId}`,
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
      `${this._apiBase}/guest_session/${guestSessionID}/rated/movies?api_key=${process.env.REACT_APP_API_KEY_V3}&page=${page}`,
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

    return result;
  }

  async getData(endpoint, query = '', page = 1) {
    const response = await fetch(
      `${this._apiBase}${endpoint}?query=${query}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY_V4}`,
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
    return result;
  }

  async getPopularMovies(page) {
    const result = await this.getData('/movie/popular', '', page);
    return result;
  }

  async getGenresMovies() {
    const result = await this.getData('/genre/movie/list');

    return result.genres.reduce((obj, item) => {
      obj[item.id] = item.name;
      return obj;
    }, {});
  }
}

const movieService = new MovieService();

export default movieService;
