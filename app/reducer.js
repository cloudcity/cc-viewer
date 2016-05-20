import {REQUEST_DATA, RECEIVE_DATA, CHANGE_PARAMETER} from './actions';

export default function (state, {type, city, data, selectedParameter = null, parameters = []}) {
  switch (type) {
    case REQUEST_DATA:
      return Object.assign({}, state, {selectedParameter: null, city, updateRequired: true});
    case RECEIVE_DATA:
      if (!selectedParameter) {
        selectedParameter = parameters[0]
      }
      return Object.assign({}, state, {data, parameters, selectedParameter, updateRequired: false});
    case CHANGE_PARAMETER:
      return Object.assign({}, state, {selectedParameter});
    default:
      return state;
  }
}
