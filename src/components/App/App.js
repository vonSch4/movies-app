import React from 'react';
import { Offline } from 'react-detect-offline';

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
    For users from Russia: you need to enable VPN.`,
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
    this.changeTab = this.changeTab.bind(this);
    this.state = {
      data: {},
      genresList: [],
      isLoading: true,
      isError: false,
      onRatedPage: false,
      value: '',
      currentPage: 1,
      currentPageRated: 1,
      guestSessionId: localStorage.getItem('guestSessionId'),
    };
  }

  componentDidMount() {
    const { currentPage, guestSessionId } = this.state;

    if (!guestSessionId) this.createGuestSession();

    this.getPopularMovies(currentPage);
    this.getGenresMovies();
  }

  componentDidUpdate(prevProps, prevState) {
    const { value, currentPage, currentPageRated, onRatedPage } = this.state;

    if (!onRatedPage) {
      if (value && value !== prevState.value) {
        this.getFoundMovies(value, currentPage);
        return;
      }

      if (value && currentPage !== prevState.currentPage) {
        this.getFoundMovies(value, currentPage);
        return;
      }

      if (!value && value !== prevState.value) {
        this.getPopularMovies(currentPage);
        return;
      }

      if (!value && currentPage !== prevState.currentPage) {
        this.getPopularMovies(currentPage);
        return;
      }

      if (onRatedPage !== prevState.onRatedPage) {
        if (value) this.getFoundMovies(value, currentPage);
        if (!value) this.getPopularMovies(currentPage);
      }
    }

    if (onRatedPage) {
      if (onRatedPage !== prevState.onRatedPage) {
        this.getRatedMovies(currentPageRated);
      }

      if (currentPageRated !== prevState.currentPageRated) {
        this.getRatedMovies(currentPageRated);
      }
    }
  }

  onMoviesLoaded(data) {
    this.setState(() => {
      return { data };
    });

    setTimeout(() => {
      this.setState(() => {
        return { isLoading: false, isError: false };
      });
    }, 300);
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
      return {
        isLoading: true,
        isError: false,
      };
    });

    this.movieService
      .getFoundMovies(value, page)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  getPopularMovies(page) {
    this.setState(() => {
      return {
        isLoading: true,
        isError: false,
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
        isLoading: true,
        isError: false,
        currentPageRated: page,
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
    this.setState((prevState) => {
      if (prevState.onRatedPage) {
        return {
          currentPageRated: page,
        };
      }

      return {
        currentPage: page,
      };
    });
  }

  changeTab(key) {
    if (key === 'search') {
      this.setState(() => {
        return {
          onRatedPage: false,
        };
      });
    }

    if (key === 'rated') {
      this.setState(() => {
        return {
          onRatedPage: true,
        };
      });
    }
  }

  render() {
    const {
      data,
      value,
      isLoading,
      isError,
      currentPage,
      currentPageRated,
      genresList,
    } = this.state;

    const LoadError = <ErrorMessage mes={err.loadErr.m} desc={err.loadErr.d} />;
    const NetError = <ErrorMessage mes={err.netErr.m} desc={err.netErr.d} />;
    const CardListSearch = (
      <CardList
        data={data}
        changePage={this.changePage}
        page={currentPage}
        putGuestRating={this.putGuestRating}
      />
    );
    const CardListRated = (
      <CardList
        data={data}
        changePage={this.changePage}
        page={currentPageRated}
        putGuestRating={this.putGuestRating}
      />
    );

    const hasData = !(isLoading || isError);

    const loadingError = isError && LoadError;
    const loadingSpinner = isLoading && <Spinner />;
    const cardListSearch = hasData && CardListSearch;
    const cardListRated = hasData && CardListRated;

    return (
      <MovieServiceProvider value={genresList}>
        <TabsMenu
          changeTab={this.changeTab}
          loadingError={loadingError}
          loadingSpinner={loadingSpinner}
          cardListSearch={cardListSearch}
          cardListRated={cardListRated}
        >
          <Header onInputSearch={this.onInputSearch} value={value} />
        </TabsMenu>
        <Offline>
          <main className="main">{NetError}</main>
        </Offline>
      </MovieServiceProvider>
    );
  }
}
