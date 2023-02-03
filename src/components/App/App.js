import React from 'react';
import { Offline, Online } from 'react-detect-offline';
import _ from 'lodash';

import './App.css';

import MovieService from '../../services';
import Header from '../Header';
import CardList from '../CardList';
import Spinner from '../Spinner';
import ErrorMessage from '../ErrorMessage';

const err = {
  loadErr: {
    m: 'Content loading error',
    d: 'An error occurred while downloading movies',
  },
  netErr: {
    m: 'Network error',
    d: 'There is no Internet connection',
  },
};

export default class App extends React.Component {
  movieService = new MovieService();

  debouncedGetData = _.debounce(this.getData, 1000);

  constructor(props) {
    super(props);
    this.onMoviesLoaded = this.onMoviesLoaded.bind(this);
    this.onErrorLoading = this.onErrorLoading.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.state = {
      data: [],
      isLoading: true,
      isError: false,
      value: 'return',
    };
  }

  componentDidMount() {
    const { value } = this.state;

    this.getData(value);
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.state;

    if (prevState.value !== value) {
      this.debouncedGetData(value);

      this.setState(() => {
        return { data: [], isLoading: true, isError: false };
      });
    }
  }

  onMoviesLoaded(movies) {
    this.setState(() => {
      return { data: movies, isLoading: false, isError: false };
    });
  }

  onErrorLoading() {
    this.setState(() => {
      return { isLoading: false, isError: true };
    });
  }

  onSearch(value) {
    this.setState(() => {
      return {
        value,
      };
    });
  }

  getData(value) {
    this.movieService
      .getMovies(value)
      .then(this.onMoviesLoaded, this.onErrorLoading);
  }

  render() {
    const { data, isLoading, isError } = this.state;

    const hasData = !(isLoading || isError);

    const errorMessage = isError ? (
      <ErrorMessage mes={err.loadErr.m} desc={err.loadErr.d} />
    ) : null;
    const spinner = isLoading ? <Spinner /> : null;
    const content = hasData ? <CardList data={data} /> : null;

    return (
      <>
        <Header onSearch={this.onSearch} />
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
