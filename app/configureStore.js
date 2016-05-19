import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducer.js';

export default function configureStore(initialState) {
  return createStore(
    reducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  );
}

