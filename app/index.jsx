import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducer.js';
import App from './components/App.jsx';
import { fetchData } from './actions.js';

const loggerMiddleware = createLogger();

const initialState = {city: "Athens", data: [], updateRequired: true};

let store = createStore(
  reducer,
  initialState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

render(
  <Provider store={store}>
    <App />
  </Provider> ,
  document.getElementById('app')
);
