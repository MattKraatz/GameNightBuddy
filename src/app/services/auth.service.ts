import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {AngularFire, AuthProviders} from 'angularfire2';

import {AppStore} from '../models/appstore.model';

@Injectable()
export class AuthService {
  
  user: Observable<Object>;
  
  constructor(public af: AngularFire, private store: Store<AppStore>) {
    this.user = store.select("user");
    this.af.auth.subscribe(user => {
      if(user) {
        // user logged in
        this.store.dispatch({type: "LOGIN_USER", payload: user})
      }
      else {
        // user not logged in
        this.store.dispatch({type: "LOGOUT_USER"});
      }
    })
  }

  loginWithFacebook() {
    this.af.auth.login({
      provider: AuthProviders.Facebook
    })
  }

  logout() {
    this.af.auth.logout();
  }

}