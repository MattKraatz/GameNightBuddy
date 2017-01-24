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
    return <div className="profile-badge">
      Welcome {this.state.users.map((item) => item.email)}
    </div>
  }
})
