import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';

export default React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {text: ""};
  },
  componentWillMount: function() {
    var ref = Firebase.database().ref('games');
    this.bindAsArray(ref, 'games');
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRefs['games'].push({
        name: this.state.text
      });
      this.setState({
        text: ''
      });
    }
  },
  render: function() {
    return <div className="collection">
      {this.state.games.map((item, index) => {
        return <div key={item[".key"]}>
            <div>{item.name}</div>
          </div>
      })}
      <form onSubmit={ this.handleSubmit }>
        <input onChange={ this.onChange } value={ this.state.text } />
        <button>{ 'Add #' + (this.state.games.length + 1) }</button>
      </form>
    </div>
  }
})
