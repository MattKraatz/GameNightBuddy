import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';

export default React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount: function() {
    var ref = Firebase.database().ref('users');
    this.bindAsArray(ref, 'users');
  },
  render: function() {
    return <div className="members">
      {this.state.users.map((item) => {
        return <div key={item[".key"]}>{item.email}</div>;
      })}
    </div>
  }
})
