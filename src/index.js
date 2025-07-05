import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import store from './state/store'
import { Provider } from 'react-redux';


axios.interceptors.request.use(request => {
  const userDataStr = localStorage.getItem("userData");
  if (userDataStr) {
    const token = JSON.parse(userDataStr).token;
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
