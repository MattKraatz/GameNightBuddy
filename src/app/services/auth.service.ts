import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Auth} from '../models/auth.model';
import {firebaseConfig} from '../constants/firebaseConfig';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class AuthService {
  
  user: Observable<Auth>;
  
  constructor(public af: AngularFire, private store: Store<AppStore>, private http: Http) {
    this.user = store.select("auth");
    // Resolve Auth status during construction
    this.af.auth.subscribe(auth => {
      if(auth) {
        // user logged in
        if (auth.auth) {
          var user = new Auth(auth.auth);
        } else if (auth.facebook) {
          var user = new Auth(auth.facebook);
          user.uid = auth.uid;
        }
        this.getAuthRecordFromFB(user);
      }
      else {
        // user not logged in
        this.store.dispatch({type: "LOGOUT_USER", payload: ""});
      }
    })
  }

  getAuthRecordFromFB(user: Auth) {
    this.http.get(`${firebaseConfig.databaseURL}/v1/users/${user.uid}.json`)
        .map(res => res.json())
        .map(res => {
          user.firstName = res.firstName;
          user.lastName = res.lastName;
          return user;
        })
        .map(payload => ({ type: 'LOGIN_USER', payload }))
        .subscribe(action => this.store.dispatch(action));
  }

  getCurrentUser(): string {
    var output: string;
    this.af.auth.subscribe(auth => {
      if(auth) {
        // user logged in
        if (auth.auth) {
          output = auth.uid;
        }
      }
    })
    return output;
  }

  loginWithFacebook() {
    // Redirect Method (default) reloads the page, triggering the constructor
    //  so no store dispatch necessary (handled in constructor)
    this.af.auth.login()
  }

  loginWithEmailAndPassword(user: Auth) {
    this.af.auth.login({
      email: user.email,
      password: user.password
    },
    {
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    })
    .then(response => {
      console.log(response);
    })
    .catch(response => {
      console.error(response);
    })
  }

  registerEmailAndPassword(user: Auth) {
    this.af.auth.createUser({
      email: user.email,
      password: user.password
    })
    .then(response => {
      console.log(response);
    })
    .catch(response => {
      console.error(response);
    })
  }

  logout() {
    this.af.auth.logout()
    .then(response => {
      console.log("logout", response);
    })
    // No redirect on logout, update the store
    this.store.dispatch({type: "LOGOUT_USER", payload: {}});
  }

}