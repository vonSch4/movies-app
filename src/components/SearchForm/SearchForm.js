import React from 'react';

import './SearchForm.css';

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmitSearch = this.onSubmitSearch.bind(this);
    this.state = {
      value: '',
    };
  }

  onValueChange(evt) {
    const { value } = evt.target;

    this.setState(() => {
      return {
        value,
      };
    });

    const { onInputSearch } = this.props;

    if (value) {
      onInputSearch(value);
    }
  }

  onSubmitSearch(evt) {
    evt.preventDefault();

    this.setState(() => {
      return {
        value: '',
      };
    });
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
