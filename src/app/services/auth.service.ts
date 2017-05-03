import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';

import {AppStore} from '../models/appstore.model';
import {Auth} from '../models/auth.model';
import {User} from '../models/user.model';
import {firebaseConfig} from '../constants/firebaseConfig';
import {LoginViewModel} from '../viewmodels/login.viewmodel';
import {ServerConfig} from '../constants/serverConfig';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class AuthService {
  
  user: Observable<Auth>;
  currentUser: Auth;

  userProfile: Observable<User>;
  currentUserProfile: User;
  public userLoaded: boolean = false;
  
  constructor(public af: AngularFire, private store: Store<AppStore>, private http: Http, private router: Router) {
    this.user = store.select("auth");
    this.userProfile = store.select("user");
    this.user.subscribe(auth => this.currentUser = auth);
    // Resolve initial Auth status during construction
    this.af.auth.subscribe(auth => {
      if(auth) {
        // user logged in
        if (auth.auth) {
          var user = new Auth(auth.auth);
        } else if (auth.facebook) {
          var user = new Auth(auth.facebook);
          user.uid = auth.uid;
        }
        this.getAuthRecordFromDB(user);
      }
      else {
        // user not logged in
        this.store.dispatch({type: "LOGOUT_USER", payload: new User()});
      }
    })
  }

  getAuthRecordFromDB(user: Auth) {
    this.http.get(`${ServerConfig.baseUrl}/users/${user.uid}`)
        .map(res => res.json())
        .map(res => {
          var user = new User(res);
          this.currentUserProfile = user;
          return user;
        })
        .map(payload => ({ type: 'LOGIN_USER', payload }))
        .subscribe(action => {
          this.store.dispatch(action)
          this.userLoaded = true;
        });
  }

  // TODO: update this method to retrieve status from this.user Observable instead of AF
  // Add a static user object that accepts the value of the subscribed emmission in the constructor
  getCurrentUser(): Auth {
    var output: Auth;
    this.af.auth.subscribe(auth => {
      if(auth) {
        // user logged in
        if (auth.auth) output = auth.auth;
      }
    })
    return output;
  }

  updateUserInDB(user: User) {
    this.http.put(`${ServerConfig.baseUrl}/users`,JSON.stringify(user),HEADER)
      .map(res => ({ type: 'LOGIN_USER', payload: user }))
      .subscribe(action => this.store.dispatch(action));
  }

  loginWithFacebook() {
    // Redirect Method (default) reloads the page, triggering the constructor
    //  so no store dispatch necessary (handled in constructor)
    this.af.auth.login();
  }

  // TODO: call getAuthRecordFromFB() in this method
  loginWithEmailAndPassword(user: LoginViewModel) {
    this.af.auth.login({
      email: user.Email,
      password: user.Password
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
    });
  }

  // TODO: call getAuthRecordFromFB() in this method
  registerEmailAndPassword(user: LoginViewModel) {
    this.af.auth.createUser({
      email: user.Email,
      password: user.Password
    })
    .then(response => {
      console.log(response);
    })
    .catch(response => {
      console.error(response);
    });
  }

  logout() {
    this.af.auth.logout()
    .then(response => {
      console.log("logout", response);
    });
    this.store.dispatch({type: "LOGOUT_USER", payload: {}});
    this.router.navigate(['/']);
  }

}