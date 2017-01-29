import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';
import 'react-select/dist/react-select.css';

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
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>

        {this.state.members.map((item, index) => {
          return <tr key={item[".key"]}>
                  <th scope="row">{ index + 1 }</th>
                  <td>{ item.firstName } { item.lastName }</td>
                </tr>
        })}
        </tbody>
      </table>
      <h2>New Member</h2>
      <form onSubmit={ this.handleSubmit }>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input name="firstName" type="text" className="form-control" value={ this.state.newMember.firstName } onChange={ this.onChange } required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input name="lastName" type="text" className="form-control" value={ this.state.newMember.lastName } onChange={ this.onChange } required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input name="email" type="email" className="form-control" value={ this.state.newMember.email } onChange={ this.onChange } required />
        </div>
        <button className="btn btn-primary btn-block">{ 'Add #' + (this.state.members.length + 1) }</button>
      </form>
    </div>
  }
})
