import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import Firebase from 'firebase';
import {FBKeys} from './keys.js';
import App from './App';
import Home from './Home';
import Members from './components/Members';
import Collection from './components/Collection';
import Matches from './components/Matches';
import './index.css';

// Configure Firebase
Firebase.initializeApp(FBKeys);

// Auto-Login for Development purposes
// Firebase.auth().signInWithEmailAndPassword('matt@matt.com', 'password')
//   .then((success) => {
//     console.log('LOGIN', success)
//     Firebase.database().ref('users/' + success.uid).set({
//       email: success.email
//     })}
//   )
//   .catch((error) => console.error(error));


function requireAuth(nextState, replaceState) {
  if (!Firebase.auth().currentUser)
    // not sure if this works yet
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
};

const routes = <Route component={App}>
  <Route path="/" component={Home}/>
  <Route path="/members" component={Members} onEnter={requireAuth}/>
  <Route path="/collection" component={Collection} onEnter={requireAuth}/>
  <Route path="/matches" component={Matches} onEnter={requireAuth}/>
</Route>;

ReactDOM.render(
  <Router history={hashHistory}>{routes}</Router>,
  document.getElementById('root')
);
