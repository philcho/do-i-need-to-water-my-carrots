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
    let dayObj = new Date(); // Date obj
    dayObj.setDate(dayObj.getDate() - 1); // Date obj: yesterday
    let month = Number(dayObj.getMonth()) + 1;
    let day = dayObj.getFullYear() + '-' + month + '-' + dayObj.getDate();

    $.ajax({
      url: `http://localhost:3000/data/${day}`,
      success: function(entryData) {
        this.getPrecipTotal(entryData);
      }.bind(this),
      error: function(err) {
        throw new Error(err);
      }
    });
  }

  getPrecipTotal(entryData) {
    console.log('getPrecipTotal', entryData);
    let precipAccumulation = 0;

    // If data is from the DB, it's in an array
    if (Array.isArray(entryData)) {
      precipAccumulation = entryData[0].rainfall;
    } else {
    // If data is from the API, it's in an object
      precipAccumulation = entryData.rainfall;
    }

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