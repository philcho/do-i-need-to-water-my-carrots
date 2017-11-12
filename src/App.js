import React from 'react';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      precipTotal: 0
    }
  }

  extractRainfallData(entryData) {
    // If data is from the DB, it's an array
    if (Array.isArray(entryData)) {
      return entryData[0].rainfall;
    } else {
    // If data is from the API, it's an object
      return entryData.rainfall;
    }
  }

  getWeatherData(day, callback) {
    $.ajax({
      url: `http://localhost:3000/data/${day}`,
      success: function(entryData) {
        callback(entryData);
      },
      error: function(err) {
        throw new Error(err);
      }
    });
  }

  calculateRainfallTotal(numOfDays) {
    this.setState({ precipTotal: 0 });

    for (let i = 1; i <= numOfDays; i++) {
      let dayObj = new Date(); // Date obj
      dayObj.setDate(dayObj.getDate() - i); // Date obj minus i days
      let twoCharMonth = ('0' + (Number(dayObj.getMonth()) + 1)).slice(-2);
      let twoCharDay = ('0' + dayObj.getDate()).slice(-2);

      let day = dayObj.getFullYear() + '-' + twoCharMonth + '-' + twoCharDay;
      
      this.getWeatherData(day, function(entryData) {
        let rainfallAmount = this.extractRainfallData(entryData);
        let newPrecipTotal = this.state.precipTotal + rainfallAmount;
        this.setState({ precipTotal: newPrecipTotal });
      }.bind(this));
    }  
  }

  render() {
    return (
      <div>Precip Total: {this.state.precipTotal} inches</div>
    );
  }

  componentDidMount() {
    this.calculateRainfallTotal(3);
  }
}

export default App;