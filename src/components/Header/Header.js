import SearchForm from '../SearchForm';

import './Header.css';

export default function Header(props) {
  const { onSearch } = props;

  return (
    <header className="header">
      <SearchForm onSearch={onSearch} />
    </header>
  );
}
