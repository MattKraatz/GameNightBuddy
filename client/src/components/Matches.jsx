import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './Matches.css';

var gameOptions = [];
var playerOptions = [];

export default React.createClass({
  mixins: [ReactFireMixin],
  emptyInput: function(){
    return {newMatch: {
      game: '',
      date: '',
      players: [],
      winner: ''
    }}
  },
  getInitialState: function() {
    return this.emptyInput();
  },
  componentWillMount: function() {
    // Establish Firebase state connections
    var matchRef = Firebase.database().ref('matches');
    this.bindAsArray(matchRef, 'matches');

    var memberRef = Firebase.database().ref('members');
    this.bindAsArray(memberRef, 'members');

    var gameRef = Firebase.database().ref('games');
    this.bindAsArray(gameRef,'games');

    // SELECT
    // GAME OPTIONS
    if (!this.state.games || this.state.games.length === 0)
    {
      Firebase.database().ref('games').once('value')
        .then(function(snapshot) {
          var games = snapshot.val();
          for (var prop in games) {
            if (games.hasOwnProperty(prop)) {
              gameOptions.push({ value: games[prop].name, label: games[prop].name , type: 'select', name: 'game' })
            }
          };
          gameOptions.push({ value: 'new', label: '- new game -' });
        }, function (errorObject) {
          console.error("The read failed: " + errorObject.code);
        });
    } else {
      var games = this.state.games;
      games.forEach((e, i) => {
        gameOptions.push({ value: e.name, label: e.name, type: 'select', name: 'game' })
      });
      gameOptions.push({ value: 'new', label: '- new game -' });
    }

    // SELECT
    // PLAYER OPTIONS
    if (!this.state.members || this.state.members.length === 0)
    {
      Firebase.database().ref('members').once('value')
        .then(function(snapshot) {
          var members = snapshot.val();
          for (var prop in members) {
            if (members.hasOwnProperty(prop)) {
              var name = members[prop].firstName + " " + members[prop].lastName;
              playerOptions.push({ value: name, label: name, type: 'select', name: 'players' })
            }
          };
          playerOptions.push({ value: 'new', label: '- guest -' });
        }, function (errorObject) {
          console.error("The read failed: " + errorObject.code);
        });
    } else {
      this.state.members.forEach((e, i) => {
        var name = e.firstName + " " + e.lastName;
        playerOptions.push({ value: name, label: name, type: 'select', name: 'players' })
      });
      playerOptions.push({ value: 'new', label: '- guest -' });
    }

  },
  onChange: function(e) {
    if (e) {
      const match = this.state.newMatch;
      if (!e.target & !e.length) {
        const name = e.name;
        match[name] = e.value;
        this.setState(match);
      // Handle players multi-select
      } else if (!e.target & e.length > -1) {
        match.players = e;
        // Change the option name for the Winner Select
        match.players.forEach((e,i) => {
          e.name = "winner";
        })
        this.setState(match);
      } else {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        match[name] = value;
        this.setState(match);
      }
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.firebaseRefs['matches'].push(this.state.newMatch);
    this.setState(this.emptyInput());
  },
  render: function() {
    return <div className="matches">
      <h2>Match History</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Game</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
        {this.state.matches.map((item, index) => {
          return <tr key={item[".key"]}>
                  <th scope="row">{ item.date }</th>
                  <td>{ item.game }</td>
                  <td>{ item.winner }</td>
                </tr>
        })}
        </tbody>
      </table>
      <h2>New Match</h2>
      <form onSubmit={ this.handleSubmit }>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input name="date" type="date" className="form-control" value={ this.state.newMatch.date } onChange={ this.onChange } required />
        </div>
        <div className="form-group">
          <label htmlFor="game">Game</label>
          <Select name="game" value={ this.state.newMatch.game } options={ gameOptions } onChange={ this.onChange } required />
        </div>
        <div className="form-group">
          <label htmlFor="players">Players</label>
          <Select name="players" value={ this.state.newMatch.players } options={ playerOptions } onChange={ this.onChange } multi={ true } clearable={ false } required />
        </div>
        <div className="form-group">
          <label htmlFor="winner">Winner</label>
          <Select name="winner" value={ this.state.newMatch.winner } options={ this.state.newMatch.players } onChange={ this.onChange } />
          <small id="winnerHelp" className="form-text text-muted">Selectable from the list of Players.</small>
        </div>
        <button className="btn btn-primary btn-block">{ 'Add #' + (this.state.matches.length + 1) }</button>
      </form>
    </div>
  }
})
