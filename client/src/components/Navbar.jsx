import React from 'react';
import {Link} from 'react-router';
import ProfileBadge from './ProfileBadge';

export default class App extends React.Component {

  render() {
    return <div>
        <ul id="navigation">
          <li><Link to='#'>Home</Link></li>
          <li><Link to='collection'>Collection</Link></li>
          <li><Link to='members'>Members</Link></li>
          <li><Link to='matches'>Matches</Link></li>
        </ul>
      </div>
  }

}
