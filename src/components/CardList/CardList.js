import { Space, Pagination } from 'antd';

import Card from '../Card';

import './CardList.css';

export default function CardList(props) {
  const { data } = props;

  const cards = data.map((el) => {
    return <Card key={el.id} data={el} />;
  });

  return (
    <Space direction="vertical" align="center" size={30}>
      <ul className="card-list">{cards}</ul>
      <Pagination className="pagination" defaultCurrent={1} total={50} />
    </Space>
  );
}
