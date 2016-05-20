import React from 'react';
import {connect} from 'react-redux';
import Chart from './Chart.jsx';
import {requestData, fetchData} from '../actions.js';

const mapStateToProps = ({city, updateRequired, parameters, selectedParameters}) => {
  return {city, updateRequired, parameters, selectedParameters};
};

class App extends React.Component {
  componentDidMount() {
    const {dispatch, updateRequired, city} = this.props;
    if (updateRequired) {
      dispatch(fetchData(city));
    }
  }

  componentWillReceiveProps({dispatch, updateRequired, city}) {
    if (updateRequired) {
      dispatch(fetchData(city));
    }
  }

  render() {
    let {city, parameters, selectedParameter, dispatch} = this.props;

    return (
      <div>
        <form onSubmit={e => {
          e.preventDefault();
          if (!city.value.trim()) {return;}
          dispatch(requestData(city.value));
        }}>
          <label>Find a location</label>
          <input className={'inline'} defaultValue={city} ref={node => {
            city = node;
          }}/>
          <button type="submit">Change City</button>
        </form>
        <Chart />
      </div>
    )
  }
}

export default connect(mapStateToProps)(App);
