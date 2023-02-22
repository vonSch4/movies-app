import React from 'react';

import './App.css';

import movieService from '../../services';
import { setItem, getItem } from '../../utils';
import transformMoviesData from '../../mappers';
import { GenresListProvider } from '../GenresListContext';
import TabsMenu from '../TabsMenu';
import Header from '../Header';
import CardList from '../CardList';
import Spinner from '../Spinner';
import ErrorMessage from '../ErrorMessage';

const errors = {
  loadindError: {
    message: 'Content loading error',
    description: `An error occurred while downloading movies.
    For users from Russia: you need to enable VPN.`,
  },
  networkError: {
    message: 'Network error',
    description: 'There is no Internet connection.',
  },
};

const tabs = {
  search: 'Search',
  rated: 'Rated',
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      genresList: [],
      isLoading: true,
      isError: false,
      onRatedPage: false,
      value: '',
      currentPage: 1,
      currentPageRated: 1,
      guestSessionId: getItem('guestSessionId'),
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

    if (!onRatedPage && onRatedPage !== prevState.onRatedPage) {
      if (value) this.getFoundMovies(value, currentPage);
      if (!value) this.getPopularMovies(currentPage);
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

  onMoviesLoaded = (data) => {
    this.setState(() => {
      return { data: transformMoviesData(data) };
    });

    setTimeout(() => {
      this.setState(() => {
        return { isLoading: false, isError: false };
      });
    }, 300);
  };

  onErrorLoading = () => {
    this.setState(() => {
      return { isLoading: false, isError: true };
    });
  };

  onInputSearch = (value) => {
    this.setState(() => {
      return {
        value,
        currentPage: 1,
      };
    });

    if (value) this.getFoundMovies(value);
    if (!value) this.getPopularMovies();
  };

  getFoundMovies = (value, page) => {
    this.setState(() => {
      return {
        isLoading: true,
        isError: false,
      };
    });

    movieService
      .getFoundMovies(value, page)
      .then(this.onMoviesLoaded)
      .catch(this.onErrorLoading);
  };

  getPopularMovies = (page) => {
    this.setState(() => {
      return {
        isLoading: true,
        isError: false,
      };
    });

    movieService
      .getPopularMovies(page)
      .then(this.onMoviesLoaded)
      .catch(this.onErrorLoading);
  };

  getRatedMovies = (page) => {
    const { guestSessionId } = this.state;

    this.setState(() => {
      return {
        isLoading: true,
        isError: false,
        currentPageRated: page,
      };
    });

    movieService
      .getRatedMovies(guestSessionId, page)
      .then(this.onMoviesLoaded)
      .catch(this.onErrorLoading);
  };

  getGenresMovies = () => {
    movieService
      .getGenresMovies()
      .then((genres) => {
        this.setState(() => {
          return {
            genresList: genres,
          };
        });
      })
      .catch(this.onErrorLoading);
  };

  putGuestRating = (movieId, value) => {
    const { guestSessionId } = this.state;

    const ratedMovies = getItem('ratedMovies') || {};
    ratedMovies[movieId] = value;

    setItem('ratedMovies', ratedMovies);

    movieService.putGuestRating(movieId, guestSessionId, value);
  };

  createGuestSession = () => {
    movieService
      .createGuestSession()
      .then(({ guest_session_id: guestSessionId }) => {
        this.setState(() => {
          return {
            guestSessionId,
          };
        });

        setItem('guestSessionId', guestSessionId);
      });
  };

  changePage = (page) => {
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

    const { value } = this.state;

    if (value) this.getFoundMovies(value, page);
    if (!value) this.getPopularMovies(page);
  };

  changeTab = (key) => {
    if (key === tabs.search) {
      this.setState(() => {
        return {
          onRatedPage: false,
        };
      });
    }

    if (key === tabs.rated) {
      this.setState(() => {
        return {
          onRatedPage: true,
        };
      });
    }
  };

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

    const LoadingError = (
      <ErrorMessage
        message={errors.loadindError.message}
        description={errors.loadindError.description}
      />
    );
    const NetworkError = (
      <ErrorMessage
        message={errors.networkError.message}
        description={errors.networkError.description}
      />
    );
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

    const networkError = !navigator.onLine && NetworkError;
    const loadingError = isError && LoadingError;
    const loadingSpinner = isLoading && <Spinner />;
    const cardListSearch = hasData && CardListSearch;
    const cardListRated = hasData && CardListRated;

    return (
      <GenresListProvider value={genresList}>
        <TabsMenu
          changeTab={this.changeTab}
          tabs={tabs}
          loadingError={loadingError}
          networkError={networkError}
          loadingSpinner={loadingSpinner}
          cardListSearch={cardListSearch}
          cardListRated={cardListRated}
        >
          <Header onInputSearch={this.onInputSearch} value={value} />
        </TabsMenu>
      </GenresListProvider>
    );
  }
}
