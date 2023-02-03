import { Alert } from 'antd';

import './ErrorMessage.css';

export default function ErrorMessage({ mes, desc }) {
  return <Alert message={mes} type="error" description={desc} showIcon />;
}
