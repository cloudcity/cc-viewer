import fetch from 'isomorphic-fetch';

export const REQUEST_DATA = 'REQUEST_DATA';

export function requestData(city) {
  return {
    type: REQUEST_DATA,
    city
  };
}

export const RECEIVE_DATA = 'RECEIVE_DATA';

export function receiveData(city, json) {
  return {
    type: RECEIVE_DATA,
    city,
    data: json.results
  };
}

export function fetchData(city) {
  return dispatch => {
    return fetch(`https://api.openaq.org/v1/measurements?country=US&city=${city}&limit=1000&parameter=o3`)
      .then(response => response.json())
      .then(json => dispatch(receiveData(city, json)));
  };
}
