import React from 'react';
import { Offline, Online } from 'react-detect-offline';

import './App.css';

import MovieService from '../../services';
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
  movieService = new MovieService();

  constructor(props) {
    super(props);
    this.onMoviesLoaded = this.onMoviesLoaded.bind(this);
    this.onErrorLoading = this.onErrorLoading.bind(this);
    this.onInputSearch = this.onInputSearch.bind(this);
    this.changePage = this.changePage.bind(this);
    this.state = {
      data: {},
      isLoading: true,
      isError: false,
      value: null,
      currentPage: 1,
    };
  }

  componentDidMount() {
    const { currentPage } = this.state;

    this.getPopularMovies(currentPage);
  }

  componentDidUpdate(prevProps, prevState) {
    const { value, currentPage } = this.state;

    if (!value && prevState.currentPage !== currentPage) {
      this.getPopularMovies(currentPage);

      this.setState(() => {
        return { isLoading: true, isError: false };
      });
    }

    if (prevState.value !== value) {
      this.getFoundMovies(value, currentPage);

      this.setState(() => {
        return { isLoading: true, isError: false, currentPage: 1 };
      });
    }

    if (value && prevState.currentPage !== currentPage) {
      this.getFoundMovies(value, currentPage);

      this.setState(() => {
        return { isLoading: true, isError: false };
      });
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
      };
    });
  }

  getFoundMovies(value, page) {
    this.movieService
      .getMovies(value, page)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  getPopularMovies(page) {
    this.movieService
      .getPopularMovies(page)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  changePage(page) {
    this.setState(() => {
      return {
        currentPage: page,
      };
    });
  }

  render() {
    const { data, isLoading, isError } = this.state;

    const hasData = !(isLoading || isError);

    const errorMessage = isError ? (
      <ErrorMessage mes={err.loadErr.m} desc={err.loadErr.d} />
    ) : null;
    const spinner = isLoading ? <Spinner /> : null;
    const content = hasData ? (
      <CardList data={data} changePage={this.changePage} />
    ) : null;

    return (
      <>
        <Header onInputSearch={this.onInputSearch} />
        <Online>
          <main className="main">
            {errorMessage}
            {spinner}
            {content}
          </main>
        </Online>
        <Offline>
          <main className="main">
            <ErrorMessage mes={err.netErr.m} desc={err.netErr.d} />
          </main>
        </Offline>
      </>
    );
  }
}
