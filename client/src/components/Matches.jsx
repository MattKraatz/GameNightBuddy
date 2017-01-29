import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

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
    var matchRef = Firebase.database().ref('matches');
    this.bindAsArray(matchRef, 'matches');

    var memberRef = Firebase.database().ref('members');
    this.bindAsArray(memberRef, 'members');

    var gameRef = Firebase.database().ref('games');
    this.bindAsArray(gameRef,'games');
  },
  getGameOptions: function(input, callback) {
    var options = [];
    if (this.state.games.length === 0)
    {
      Firebase.database().ref('games').once('value')
        .then(function(snapshot) {
          var games = snapshot.val();
          for (var prop in games) {
            options.push({ value: games[prop].name, label: games[prop].name , type: 'select', name: 'game' })
          };
          options.push({ value: 'new', label: '- new game -' });
          callback(null, { options: options, complete: true });
        }, function (errorObject) {
          console.error("The read failed: " + errorObject.code);
        });
    } else {
      var games = this.state.games;
      games.forEach((e, i) => {
        options.push({ value: e.name, label: e.name, type: 'select', name: 'game' })
      });
      options.push({ value: 'new', label: '- new game -' });
      callback(null, { options: options, complete: true });
    }
  },
  getPlayerOptions: function(input, callback) {
    var options = [];
    if (this.state.members.length === 0)
    {
      Firebase.database().ref('members').once('value')
        .then(function(snapshot) {
          var members = snapshot.val();
          for (var prop in members) {
            var name = members[prop].firstName + " " + members[prop].lastName;
            options.push({ value: name, label: name, type: 'select', name: 'players' })
          };
          options.push({ value: 'new', label: '- guest -' });
          callback(null, { options: options, complete: true });
        }, function (errorObject) {
          console.error("The read failed: " + errorObject.code);
        });
    } else {
      var members = this.state.members;
      members.forEach((e, i) => {
        var name = e.firstName + " " + e.lastName;
        options.push({ value: name, label: name, type: 'select', name: 'players' })
      });
      options.push({ value: 'new', label: '- guest -' });
      callback(null, { options: options, complete: true });
    }
  },
  onChange: function(e) {
    if (e) {
      console.log(e)
      if (!e.target) {
        const name = e.name;
        const match = this.state.newMatch;
        match[name] = e.value;
        this.setState(match);
        // Handle players multi-select
        if (e.length > -1) {
          const newMatch = this.state.newMatch;
          newMatch.players = e;
          // Change the option name for the Winner Select
          newMatch.players.forEach((e,i) => {
            e.name = "winner";
          })
          this.setState(newMatch);
        }
      } else {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const match = this.state.newMatch;
        match[name] = value;
        this.setState(match);
      }
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.newMatch.name && this.state.newMatch.name.trim().length !== 0) {
      this.firebaseRefs['matches'].push(this.state.newMatch);
      this.setState(this.emptyInput());
    }
  },
  render: function() {
    return <div className="matches">
      <h2>Matches Completed</h2>
      <ul>
        {this.state.matches.map((item, index) => {
          return <li key={item[".key"]}>{item.date}: {item.winner}</li>
        })}
      </ul>
      <h2>New Match</h2>
      <form onSubmit={ this.handleSubmit }>
        <label htmlFor="date">Date</label>
          <input name="date" type="date" value={ this.state.newMatch.date } onChange={ this.onChange } required />
        <br />
        <label htmlFor="game">Game</label>
          <Select.Async name="game" value={ this.state.newMatch.game } loadOptions={ this.getGameOptions } onChange={ this.onChange } required />
        <br />
        <label htmlFor="players">Players</label>
          <Select.Async name="players" value={ this.state.newMatch.players } loadOptions={ this.getPlayerOptions } onChange={ this.onChange } multi={ true } clearable={ false } required />
        <br />
        <label htmlFor="winner">Winner</label>
          <Select name="winner" value={ this.state.newMatch.winner } options={ this.state.newMatch.players } onChange={ this.onChange } />
        <br />
        <button>{ 'Add #' + (this.state.games.length + 1) }</button>
      </form>
    </div>
  }
})
