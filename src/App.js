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

  getPastDate(numDaysInPast) {
    let dayObj = new Date();
    dayObj.setDate(dayObj.getDate() - numDaysInPast);
    let twoCharMonth = ('0' + (Number(dayObj.getMonth()) + 1)).slice(-2);
    let twoCharDay = ('0' + dayObj.getDate()).slice(-2);
    return dayObj.getFullYear() + '-' + twoCharMonth + '-' + twoCharDay;
  }

  calculateRainfallTotal(numOfDays) {
    this.setState({ precipTotal: 0 });

    for (let i = 1; i <= numOfDays; i++) {
      let day = this.getPastDate(i);
      
      this.getWeatherData(day, function(entryData) {
        let rainfallAmount = this.extractRainfallData(entryData);
        let newPrecipTotal = this.state.precipTotal + rainfallAmount;
        this.setState({ precipTotal: newPrecipTotal }); // TODO: Make this work without having to set state every iteration (Promises?)
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