import React from 'react';
import { Offline, Online } from 'react-detect-offline';

import './App.css';

import MovieService from '../../services';
import { MovieServiceProvider } from '../MovieServiceContext';
import TabsMenu from '../TabsMenu';
import Header from '../Header';
import CardList from '../CardList';
import Spinner from '../Spinner';
import ErrorMessage from '../ErrorMessage';

const err = {
  loadErr: {
    m: 'Content loading error',
    d: `An error occurred while downloading movies.
    For users from Russia:  you need to enable VPN.`,
  },
  netErr: {
    m: 'Network error',
    d: 'There is no Internet connection.',
  },
};

export default class App extends React.Component {
  static saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }

  movieService = new MovieService();

  constructor(props) {
    super(props);
    this.onMoviesLoaded = this.onMoviesLoaded.bind(this);
    this.onErrorLoading = this.onErrorLoading.bind(this);
    this.onInputSearch = this.onInputSearch.bind(this);
    this.putGuestRating = this.putGuestRating.bind(this);
    this.getGuestRating = this.getGuestRating.bind(this);
    this.getPopularMovies = this.getPopularMovies.bind(this);
    this.changePage = this.changePage.bind(this);
    this.state = {
      data: {},
      genresList: [],
      isLoading: true,
      isError: false,
      ratedPage: false,
      value: null,
      currentPage: 1,
      guestSessionId: localStorage.getItem('guestSessionId'),
    };
  }

  componentDidMount() {
    const { currentPage } = this.state;

    this.getPopularMovies(currentPage);
    this.getGenresMovies();

    const guestSessionId = localStorage.getItem('guestSessionId');

    if (!guestSessionId) this.createGuestSession();
  }

  componentDidUpdate(prevProps, prevState) {
    const { value, currentPage, ratedPage } = this.state;

    if (!value && prevState.currentPage !== currentPage && !ratedPage) {
      this.getPopularMovies(currentPage);
    }

    if (prevState.value !== value && !ratedPage) {
      this.getFoundMovies(value, currentPage);
    }

    if (value && prevState.currentPage !== currentPage && !ratedPage) {
      this.getFoundMovies(value, currentPage);
    }

    if (ratedPage && prevState.currentPage !== currentPage) {
      this.getGuestRating(currentPage);
    }
  }

  onMoviesLoaded(data) {
    this.setState(() => {
      return { data, isLoading: false, isError: false };
    });
  }

  onErrorLoading() {
    this.setState(() => {
      return { isLoading: false, isError: true };
    });
  }

  onInputSearch(value) {
    this.setState(() => {
      return {
        value,
        currentPage: 1,
      };
    });
  }

  getFoundMovies(value, page) {
    this.setState(() => {
      return { isLoading: true, isError: false, ratedPage: false };
    });
    this.movieService
      .getMovies(value, page)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  getPopularMovies(page) {
    this.setState(() => {
      return { isLoading: true, isError: false, ratedPage: false };
    });

    this.movieService
      .getPopularMovies(page)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  getGenresMovies() {
    this.movieService.getGenresMovies().then((res) => {
      this.setState(() => {
        return {
          genresList: res,
        };
      });
    });
  }

  getGuestRating(page = 1) {
    const { guestSessionId } = this.state;

    this.setState(() => {
      return {
        isLoading: true,
        isError: false,
        ratedPage: true,
        currentPage: page,
      };
    });

    this.movieService
      .getGuestRating(guestSessionId, page)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  putGuestRating(movieId, value) {
    const { guestSessionId } = this.state;

    localStorage.setItem(movieId, value);

    this.movieService.putGuestRating(movieId, guestSessionId, value);
  }

  createGuestSession() {
    this.movieService
      .createGuestSession()
      .then(({ guest_session_id: guestSessionId }) => {
        this.setState(() => {
          return {
            guestSessionId,
          };
        });
        App.saveToLocalStorage('guestSessionId', guestSessionId);
      });
  }

  changePage(page) {
    this.setState(() => {
      return {
        currentPage: page,
      };
    });
  }

  render() {
    const { data, isLoading, isError, currentPage, genresList } = this.state;

    const LoadError = <ErrorMessage mes={err.loadErr.m} desc={err.loadErr.d} />;
    const NetError = <ErrorMessage mes={err.netErr.m} desc={err.netErr.d} />;
    const CardListContent = (
      <CardList
        data={data}
        changePage={this.changePage}
        page={currentPage}
        putGuestRating={this.putGuestRating}
      />
    );

    const hasData = !(isLoading || isError);

    const loadingError = isError ? LoadError : null;
    const loadingSpinner = isLoading ? <Spinner /> : null;
    const cardListContent = hasData ? CardListContent : null;

    return (
      <MovieServiceProvider value={genresList}>
        <TabsMenu
          getGuestRating={this.getGuestRating}
          getPopularMovies={this.getPopularMovies}
        >
          <Header onInputSearch={this.onInputSearch} />
          <Online>
            <main className="main">
              {loadingError}
              {loadingSpinner}
              {cardListContent}
            </main>
          </Online>
        </TabsMenu>
        <Offline>
          <main className="main">{NetError}</main>
        </Offline>
      </MovieServiceProvider>
    );
  }
}
