import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';

import './index.css';
import 'antd/dist/reset.css';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
