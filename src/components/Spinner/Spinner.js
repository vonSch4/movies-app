import { Spin } from 'antd';

import './Spinner.css';

export default function Spinner() {
  return (
    <div className="spinner">
      <Spin tip="Loading..." size="large">
        <div className="content" />
      </Spin>
    </div>
  );
}
