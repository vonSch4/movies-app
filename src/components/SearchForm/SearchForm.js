import React from 'react';
import _ from 'lodash';

import './SearchForm.css';

export default class SearchForm extends React.Component {
  debouncedSendValue = _.debounce(this.sendValue, 500);

  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmitSearch = this.onSubmitSearch.bind(this);
    const { value } = this.props;
    this.state = {
      value,
    };
  }

  onValueChange(evt) {
    const { value } = evt.target;

    this.setState(() => {
      return {
        value,
      };
    });

    this.debouncedSendValue(value);
  }

  onSubmitSearch(evt) {
    evt.preventDefault();

    this.setState(() => {
      return {
        value: '',
      };
    });

    this.debouncedSendValue('');
  }

  sendValue(value) {
    const { onInputSearch } = this.props;

    onInputSearch(value);
  }

  render() {
    const { value } = this.state;

    return (
      <form className="header-form" onSubmit={this.onSubmitSearch}>
        <label>
          <input
            className="search-field"
            placeholder="Type to search..."
            tabIndex={0}
            value={value}
            onChange={this.onValueChange}
          />
        </label>
      </form>
    );
  }
}
