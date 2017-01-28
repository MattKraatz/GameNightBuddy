import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';

export default React.createClass({
  mixins: [ReactFireMixin],
  emptyInput: function(){
    return {newMember: {
      firstName: '',
      lastName: '',
      email: ''
    }}
  },
  getInitialState: function() {
    return this.emptyInput();
  },
  componentWillMount: function() {
    var ref = Firebase.database().ref('members');
    this.bindAsArray(ref, 'members');
  },
  onChange: function(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const member = this.state.newMember;
    member[name] = value;
    this.setState(member);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.newMember.firstName && this.state.newMember.firstName.trim().length !== 0) {
      this.firebaseRefs['members'].push(this.state.newMember);
      this.setState(this.emptyInput());
    }
  },
  render: function() {
    return <div className="members">
      <h2>Members</h2>
      <ul>
        {this.state.members.map((item, index) => {
          return <li key={item[".key"]}>{item.firstName} {item.lastName}</li>
        })}
      </ul>
      <h2>New Game</h2>
      <form onSubmit={ this.handleSubmit }>
        <label htmlFor="firstName">First Name</label>
          <input name="firstName" value={ this.state.newMember.firstName } onChange={ this.onChange } required />
        <br />
        <label htmlFor="lastName">Last Name</label>
          <input name="lastName" value={ this.state.newMember.lastName } onChange={ this.onChange } required />
        <br />
        <label htmlFor="email">Email</label>
          <input name="email" value={ this.state.newMember.email } onChange={ this.onChange } required />
        <button>{ 'Add #' + (this.state.members.length + 1) }</button>
      </form>
    </div>
  }
})
