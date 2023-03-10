import SearchForm from '../SearchForm';

import './Header.css';

export default function Header(props) {
  const { onInputSearch, value } = props;

  return (
    <header className="header">
      <SearchForm onInputSearch={onInputSearch} value={value} />
    </header>
  );
}
