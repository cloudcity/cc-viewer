import React from 'react';
import { connect } from 'react-redux';
import Chart from './Chart.jsx';
import { requestData, fetchData } from '../actions.js';

const mapStateToProps = ({data, city, updateRequired}) => {
  return {data, city, updateRequired};
};

class App extends React.Component {
  componentDidMount() {
    const { dispatch, updateRequired, city } = this.props;
    if (updateRequired) {dispatch(fetchData(city));}
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, updateRequired, city } = nextProps;
    if (updateRequired) {dispatch(fetchData(city));}
  }

  render() {
    let {city} = this.props;

    return (
      <div>
        <form onSubmit={e => {
            e.preventDefault();
            if (!city.value.trim()) { return; };
            this.props.dispatch(requestData(city.value));
          }}>
          <input defaultValue={city} ref={node => {city = node;}} />
          <button type="submit">Change City</button>
        </form>
        <Chart data={this.props.data} />
      </div>
    )
  }
}

export default connect(mapStateToProps)(App);
