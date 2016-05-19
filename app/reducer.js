import { REQUEST_DATA, RECEIVE_DATA } from './actions';
import 'd3';

export default function (state, {type, city, data, params}) {
  switch (type) {
  case REQUEST_DATA:
    return Object.assign({}, state, {city, updateRequired: true});
  case RECEIVE_DATA:
    return Object.assign({}, state, {data, params, updateRequired: false});
  default:
    return state;
  }
}
