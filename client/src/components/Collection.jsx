import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';

export default React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount: function() {
    var ref = Firebase.database().ref('games');
    this.bindAsArray(ref, 'games');
  },
  render: function() {
    return <div className="collection">
      {this.state.games.map((item, index) => {
        return <div key={item[".key"]}>{item.name}</div>;
      })}
    </div>
  }
})
