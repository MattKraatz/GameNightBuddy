import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default React.createClass({
  mixins: [ReactFireMixin],
  emptyInput: function(){
    return {newGame: {
      name: '',
      minPlayers: '',
      maxPlayers: '',
      owner: ''
    }}
  },
  getInitialState: function() {
    return this.emptyInput();
  },
  componentWillMount: function() {
    var gameRef = Firebase.database().ref('games');
    this.bindAsArray(gameRef, 'games');

    var memberRef = Firebase.database().ref('members');
    this.bindAsArray(memberRef, 'members');
  },
  onChange: function(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const game = this.state.newGame;
    game[name] = value;
    this.setState(game);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.newGame.name && this.state.newGame.name.trim().length !== 0) {
      this.firebaseRefs['games'].push(this.state.newGame);
      this.setState(this.emptyInput());
    }
  },
  render: function() {
    return <div className="collection">
      <h2>Games Available</h2>
      <ul>
        {this.state.games.map((item, index) => {
          return <li key={item[".key"]}>{item.name} owned by {item.owner}, {item.minPlayers} - {item.maxPlayers} players</li>
        })}
      </ul>
      <h2>New Game</h2>
      <form onSubmit={ this.handleSubmit }>
        <label htmlFor="name">Name</label>
          <input name="name" value={ this.state.newGame.name } onChange={ this.onChange } required />
        <br />
        <label htmlFor="owner">Owner</label>
          <select name="owner" value={ this.state.newGame.owner } onChange={ this.onChange } required>
            <option value="">Please Select</option>
            {this.state.members.map((item, index) => {
              return <option key={item[".key"]} value={item.firstName + " " + item.lastName}>{ item.firstName } { item.lastName }</option>
            })}
          </select>
        <br />
        <label htmlFor="minPlayers">Minimum # of Players</label>
          <input name="minPlayers" value={ this.state.newGame.minPlayers } onChange={ this.onChange } required />
        <br />
        <label htmlFor="maxPlayers">Maximum # of Players</label>
          <input name="maxPlayers" value={ this.state.newGame.maxPlayers } onChange={ this.onChange } required />
        <br />
        <button>{ 'Add #' + (this.state.games.length + 1) }</button>
      </form>
    </div>
  }
})
