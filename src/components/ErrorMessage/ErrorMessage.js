import { Alert } from 'antd';

import './ErrorMessage.css';

export default function ErrorMessage({ message, description }) {
  return (
    <Alert message={message} type="error" description={description} showIcon />
  );
}
