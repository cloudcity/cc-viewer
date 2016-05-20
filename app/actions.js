import fetch from 'isomorphic-fetch';
import d3 from 'd3';

export const REQUEST_DATA = 'REQUEST_DATA';

export function requestData(city) {
  return {
    type: REQUEST_DATA,
    city
  };
}

export const RECEIVE_DATA = 'RECEIVE_DATA';

export function receiveData(city, json, parameters) {
  return {
    type: RECEIVE_DATA,
    city,
    data: json.results,
    parameters
  };
}

export const CHANGE_PARAMETER = 'CHANGE_PARAMETER';

export function fetchData(city) {
  return dispatch => {
    return fetch(`https://api.openaq.org/v1/measurements?country=US&city=${city}&limit=1000`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response from server');
        }
        return response.json()
      })
      .then(json => dispatch(receiveData(city, json, parameters(json))));
  };
}


const parameters = (json) => {
  return d3.nest()
    .key(d3h('parameter'))
    .map(json.results, d3.map)
    .keys();
}
