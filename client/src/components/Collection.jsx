import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

var ownerOptions = [];

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

    // SELECT
    // Owner Options
    if (!this.state.members || this.state.members.length === 0)
    {
      Firebase.database().ref('members').once('value')
        .then(function(snapshot) {
          var members = snapshot.val();
          for (var prop in members) {
            if (members.hasOwnProperty(prop)) {
              var name = members[prop].firstName + " " + members[prop].lastName;
              ownerOptions.push({ value: name, label: name, type: 'select', name: 'owner' })
            }
          };
        }, function (errorObject) {
          console.error("The read failed: " + errorObject.code);
        });
    } else {
      var members = this.state.members;
      members.forEach((e, i) => {
        var name = e.firstName + " " + e.lastName;
        ownerOptions.push({ value: name, label: name, type: 'select', name: 'owner' })
      });
    }
  },
  onChange: function(e) {
    const game = this.state.newGame;
    if (!e.target) {
      game[e.name] = e.value;
    } else {
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      game[name] = value;
    }
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
      <table className="table">
        <thead>
          <tr>
            <th>Game</th>
            <th>Players</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
        {this.state.games.map((item, index) => {
          return <tr key={item[".key"]}>
                  <th scope="row">{ item.name }</th>
                  <td>{ item.minPlayers } - { item.maxPlayers }</td>
                  <td>{ item.owner }</td>
                </tr>
        })}
        </tbody>
      </table>
      <h2>New Game</h2>
      <form onSubmit={ this.handleSubmit }>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input name="name" type="text" className="form-control" value={ this.state.newGame.name } onChange={ this.onChange } required />
        </div>
        <div className="form-group">
          <label htmlFor="owner">Owner</label>
          <Select name="owner" value={ this.state.newGame.owner } options={ ownerOptions } onChange={ this.onChange } required />
        </div>
        <div className="form-group">
          <label htmlFor="minPlayers">Minimum # of Players</label>
          <input name="minPlayers" type="number" className="form-control" value={ this.state.newGame.minPlayers } onChange={ this.onChange } required />
        </div>
        <div className="form-group">
          <label htmlFor="maxPlayers">Maximum # of Players</label>
          <input name="maxPlayers" type="number" className="form-control" value={ this.state.newGame.maxPlayers } onChange={ this.onChange } required />
        </div>
        <button className="btn btn-primary btn-block">{ 'Add #' + (this.state.games.length + 1) }</button>
      </form>
    </div>
  }
})
