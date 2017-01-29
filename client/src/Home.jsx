import React, { Component } from 'react';
import logo from './logo.svg';
import './Home.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Game Night Buddy</h2>
        </div>
        <p className="App-intro">
          Click on the navigation above to explore.
        </p>
      </div>
    );
  }
}

export default App;
