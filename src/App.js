import React from 'react';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      precipTotal: 0
    }
  }

  getWeatherData() {
    $.ajax({
      url: 'http://localhost:3000/data',
      success: function(entryData) {
        this.getPrecipTotal(entryData);
      }.bind(this),
      error: function(err) {
        throw new Error(err);
      }
    });
  }

  getPrecipTotal(entryData) {
    let precipAccumulation = entryData.rainfall;
    this.setState({ precipTotal: precipAccumulation });
  }

  render() {
    return (
      <div>Precip Total: {this.state.precipTotal} inches</div>
    );
  }

  componentDidMount() {
    this.getWeatherData();
  }
}

export default App;