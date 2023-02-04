import { Space, Pagination } from 'antd';

import Card from '../Card';

import './CardList.css';

export default function CardList(props) {
  const { data, changePage } = props;

  const { page, results, totalResults } = data;

  const cards = results.map((el) => {
    return <Card key={el.id} data={el} />;
  });

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
        onChange={changePage}
      />
    </Space>
  );
}
