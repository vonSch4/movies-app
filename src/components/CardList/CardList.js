import { Space, Pagination, Alert } from 'antd';

import Card from '../Card';

import './CardList.css';

export default function CardList(props) {
  const { data, changePage } = props;

  const { page, results, totalResults } = data;

  const cards = results.map((el) => {
    return <Card key={el.id} data={el} />;
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
