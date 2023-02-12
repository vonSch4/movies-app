import { Space, Pagination, Alert } from 'antd';

import { MovieServiceConsumer } from '../MovieServiceContext';
import Card from '../Card';

import './CardList.css';

export default function CardList(props) {
  const { data, changePage, page, putGuestRating } = props;

  const { results, totalResults } = data;

  const cards = results.map((el) => {
    return (
      <MovieServiceConsumer key={el.id}>
        {(genresList) => {
          return (
            <Card
              data={el}
              genresList={genresList}
              putGuestRating={putGuestRating}
            />
          );
        }}
      </MovieServiceConsumer>
    );
  });

  if (cards.length === 0) {
    return (
      <Alert
        message="Oops"
        type="info"
        description="No movie was found for the given word :("
      />
    );
  }

  return (
    <Space direction="vertical" align="center" size={30}>
      <ul className="card-list">{cards}</ul>
      <Pagination
        className="pagination"
        defaultCurrent={1}
        defaultPageSize={20}
        current={page}
        total={totalResults}
        showSizeChanger={false}
        showQuickJumper
        hideOnSinglePage
        onChange={changePage}
      />
    </Space>
  );
}
