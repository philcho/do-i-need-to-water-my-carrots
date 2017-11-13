import React from 'react';
import $ from 'jquery';
import translation from './translation.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      precipTotal: 0,
      location: 'sf',
      showVerdict: false
    }

    this.handleQuestionClick = this.handleQuestionClick.bind(this);
  }

  extractRainfallData(entryData) {
    // If data is from the DB, it's an array
    if (Array.isArray(entryData)) {
      console.log('extractRainfallData db', entryData[0].rainfall);
      return entryData[0].rainfall;
    } else {
    // If data is from the API, it's an object
      console.log('extractRainfallData api', entryData.rainfall);
      return entryData.rainfall;
    }
  }

  getWeatherData(day, latLong, callback) {
    $.ajax({
      url: `http://localhost:3000/data/${day}/${latLong}`,
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
      let latLong = translation[this.state.location].latLong;

      this.getWeatherData(day, latLong, function(entryData) {
        let rainfallAmount = this.extractRainfallData(entryData);
        let newPrecipTotal = this.state.precipTotal + rainfallAmount;
        this.setState({ precipTotal: newPrecipTotal }); // TODO: Make this work without having to set state every iteration (Promises?)
      }.bind(this));
    }  
  }

  handleQuestionClick(e) {
    this.setState({ showVerdict: true });
  }

  render() {
    let questionText = translation[this.state.location].question;

    let verdictText = null;
    if (this.state.precipTotal > 0.5) {
      verdictText = translation[this.state.location].no;
    } else {
      verdictText = translation[this.state.location].yes;
    }

    let verdict = null;
    if (this.state.showVerdict) {
      verdict = <p className="verdict">{verdictText}</p>
    }

    return (
      <div>
        <p className="question" onClick={this.handleQuestionClick}>{questionText}</p>
        {verdict}
      </div>
    );
  }

  componentDidMount() {
    this.calculateRainfallTotal(3);
  }
}

export default App;