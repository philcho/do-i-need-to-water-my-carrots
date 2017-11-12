import React from 'react';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      precipTotal: 0
    }
  }

  getPrecipTotal(entryData) {
    // If data is from the DB, it's an array
    if (Array.isArray(entryData)) {
      // console.log('getPrecipTotal', entryData[0].rainfall);
      return entryData[0].rainfall;
    } else {
    // If data is from the API, it's an object
      return entryData.rainfall;
    }
  }

  getWeatherData(day) {
    let precipTotal = 0;

    $.ajax({
      url: `http://localhost:3000/data/${day}`,
      success: function(entryData) {
        precipTotal = this.getPrecipTotal(entryData);
        console.log('precipTotal in ajax', precipTotal);
      }.bind(this),
      error: function(err) {
        throw new Error(err);
      }
    });
    console.log('precipTotal before return', precipTotal);
    return precipTotal;
  }

  getRainfallTotal(numOfDays) {
    let newPrecipTotal = 0;

    for (let i = 1; i <= numOfDays; i++) {
      let dayObj = new Date(); // Date obj
      dayObj.setDate(dayObj.getDate() - i); // Date obj minus i days
      let twoCharMonth = ('0' + (Number(dayObj.getMonth()) + 1)).slice(-2);
      let twoCharDay = ('0' + dayObj.getDate()).slice(-2);

      let day = dayObj.getFullYear() + '-' + twoCharMonth + '-' + twoCharDay;
      newPrecipTotal += this.getWeatherData(day);
    }

    this.setState({ precipTotal: newPrecipTotal });
  }

  render() {
    return (
      <div>Precip Total: {this.state.precipTotal} inches</div>
    );
  }

  componentDidMount() {
    this.getRainfallTotal(3);
  }
}

export default App;