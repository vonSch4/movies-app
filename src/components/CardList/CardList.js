import { Pagination, Alert } from 'antd';

import { GenresListConsumer } from '../GenresListContext';
import Card from '../Card';

import './CardList.css';

export default function CardList(props) {
  const { data, changePage, page, putGuestRating } = props;

  const { results, totalResults } = data;

  const cards = results.map((el) => {
    return (
      <GenresListConsumer key={el.id}>
        {(genresList) => {
          return (
            <Card
              data={el}
              genresList={genresList}
              putGuestRating={putGuestRating}
            />
          );
        }}
      </GenresListConsumer>
    );
  });

  if (!cards.length) {
    return (
      <Alert
        message="Oops"
        type="info"
        description="No movie was found for the given word :("
      />
    );
  }

  return (
    <>
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
    </>
  );
}
