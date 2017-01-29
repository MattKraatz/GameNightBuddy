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
            options.push({ value: games[prop].name, label: games[prop].name })
          };
          options.push({ value: 'new', label: '- new game -' });
          callback(null, { options: options, complete: true });
        }, function (errorObject) {
          console.error("The read failed: " + errorObject.code);
        });
    } else {
      var games = this.state.games;
      games.forEach((e, i) => {
        options.push({ value: e.name, label: e.name })
      });
      options.push({ value: 'new', label: '- new game -' });
      callback(null, { options: options, complete: true });
    }
  },
  onChange: function(e) {
    if (e) {
      if (!e.target){
        var match = this.state.newMatch;
        match.game = e.value;
        this.setState(match);
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
          <select name="players" value={ this.state.newMatch.players } onChange={ this.onChange } required>
            <option value="">Please Select</option>
            {this.state.members.map((item, index) => {
              return <option key={item[".key"]} value={item.firstName + " " + item.lastName}>{ item.firstName } { item.lastName }</option>
            })}
          </select>
        <br />
        <label htmlFor="winner">Winner</label>
          <input name="winner" value={ this.state.newMatch.winner } onChange={ this.onChange } />
        <br />
        <button>{ 'Add #' + (this.state.games.length + 1) }</button>
      </form>
    </div>
  }
})
