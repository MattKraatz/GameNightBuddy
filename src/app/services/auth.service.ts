import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';

import {AppStore} from '../models/appstore.model';
import {User} from '../models/user.model';

@Injectable()
export class AuthService {
  
  user: Observable<User>;
  
  constructor(public af: AngularFire, private store: Store<AppStore>) {
    this.user = store.select("auth");
    // Resolve Auth status during construction
    this.af.auth.subscribe(auth => {
      if(auth) {
        // user logged in
        if (auth.auth) {
          var user = new User(auth.auth);
        } else if (auth.facebook) {
          var user = new User(auth.facebook);
          user.uid = auth.uid;
        }
        this.store.dispatch({type: "LOGIN_USER", payload: user})
      }
      else {
        // user not logged in
        this.store.dispatch({type: "LOGOUT_USER", payload: ""});
      }
    })
  }

  loginWithFacebook() {
    // Redirect Method (default) reloads the page, triggering the constructor
    //  so no store dispatch necessary (handled in constructor)
    this.af.auth.login()
  }

  loginWithEmailAndPassword(user: User) {
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

  registerEmailAndPassword(user: User) {
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