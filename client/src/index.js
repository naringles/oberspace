import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxTunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

import Reducer from "./_reducers/index";

const rootNode = document.getElementById('root');
//promise와 function받을 수 있게
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxTunk)(createStore, composeWithDevTools())

// react를 redux로 감싸줌
ReactDOM.createRoot(rootNode).render(
  <Provider
    store={createStoreWithMiddleware(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
      )} // redux 인터넷에 연결
  >
    <App />
  </Provider>
)

reportWebVitals();