import React from 'react';
import {Link} from 'react-router';

export default class App extends React.Component {

  render() {
    return <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand" href="#">Game Night Buddy</a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="#">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="collection">Collection</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="members">Members</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="matches">Matches</Link>
                </li>
              </ul>
            </div>
          </nav>
  }

}
