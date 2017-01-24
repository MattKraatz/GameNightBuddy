import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';

export default React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount: function() {
    var ref = Firebase.database().ref('matches');
    this.bindAsArray(ref, 'matches');
  },
  render: function() {
    return <div className="members">
      {this.state.matches.map((item) => {
        return <div key={item[".key"]}>{item.game} - {item.winner}</div>;
      })}
    </div>
  }
})
