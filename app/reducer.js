import { combineReducers } from 'redux';
import { fetchData, REQUEST_DATA, RECEIVE_DATA } from './actions.js';

export default function (state, action) {
  switch (action.type) {
  case REQUEST_DATA:
    return Object.assign({}, state, {city: action.city, updateRequired: true});
  case RECEIVE_DATA:
    return Object.assign({}, state, {data: action.data, updateRequired: false});
  default:
    return state;
  }
}
