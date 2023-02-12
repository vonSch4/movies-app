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
    this.getRatedMovies = this.getRatedMovies.bind(this);
    this.getPopularMovies = this.getPopularMovies.bind(this);
    this.changePage = this.changePage.bind(this);
    this.state = {
      data: {},
      genresList: [],
      isLoading: true,
      isError: false,
      onRatedPage: false,
      value: null,
      currentPage: 1,
      guestSessionId: localStorage.getItem('guestSessionId'),
    };
  }

  componentDidMount() {
    const { currentPage, guestSessionId } = this.state;

    this.getPopularMovies(currentPage);
    this.getGenresMovies();

    if (!guestSessionId) this.createGuestSession();
  }

  componentDidUpdate(prevProps, prevState) {
    const { value, currentPage, onRatedPage } = this.state;

    if (!value && prevState.currentPage !== currentPage && !onRatedPage) {
      this.getPopularMovies(currentPage);
    }

    if (prevState.value !== value && !onRatedPage) {
      this.getFoundMovies(value, currentPage);
    }

    if (value && prevState.currentPage !== currentPage && !onRatedPage) {
      this.getFoundMovies(value, currentPage);
    }

    if (onRatedPage && prevState.currentPage !== currentPage) {
      this.getRatedMovies(currentPage);
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
      return { isLoading: true, isError: false, onRatedPage: false };
    });
    this.movieService
      .getFoundMovies(value, page)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  getPopularMovies(page) {
    this.setState((prevState) => {
      const { onRatedPage, currentPage } = prevState;

      return {
        isLoading: true,
        isError: false,
        onRatedPage: false,
        currentPage: onRatedPage ? 1 : currentPage,
      };
    });

    this.movieService
      .getPopularMovies(page)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  getRatedMovies(page) {
    const { guestSessionId } = this.state;

    this.setState(() => {
      return {
        value: null,
        isLoading: true,
        isError: false,
        onRatedPage: true,
        currentPage: page,
      };
    });

    this.movieService
      .getRatedMovies(guestSessionId, page)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  getGenresMovies() {
    this.movieService.getGenresMovies().then((genres) => {
      this.setState(() => {
        return {
          genresList: genres,
        };
      });
    });
  }

  putGuestRating(movieId, value) {
    const { guestSessionId } = this.state;

    const ratedMovies = JSON.parse(localStorage.getItem('ratedMovies')) || {};
    ratedMovies[movieId] = value;

    App.saveToLocalStorage('ratedMovies', JSON.stringify(ratedMovies));

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

    const loadingError = isError && LoadError;
    const loadingSpinner = isLoading && <Spinner />;
    const cardListContent = hasData && CardListContent;

    return (
      <MovieServiceProvider value={genresList}>
        <TabsMenu
          getRatedMovies={this.getRatedMovies}
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
