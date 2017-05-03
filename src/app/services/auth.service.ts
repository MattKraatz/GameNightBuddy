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
        this.getAuthRecordFromFB(user);
      }
      else {
        // user not logged in
        this.store.dispatch({type: "LOGOUT_USER", payload: new Auth()});
      }
    })
  }

  getAuthRecordFromFB(user: Auth) {
    this.http.get(`${firebaseConfig.databaseURL}/v1/users/${user.uid}.json`)
        .map(res => res.json())
        .map(res => {
          // faking this until user update switched to azure
          var fake = new User();
          fake.DisplayName = 'Matt Kraatz'
          fake.Email = 'matt.kraatz@gmail.com'
          fake.FirstName = 'Matt'
          fake.LastName = 'Kraatz'
          fake.PhotoURL = 'https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/16105921_3385199355128_2450864181555249132_n.jpg?oh=c9af0cc6b3bd4f62d287cd986b470195&oe=599171A3'
          fake.UserId = '09F3CFF5-3B92-413A-9D27-2B033ED54BBF'

          this.currentUserProfile = fake;
          
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

  updateUserInFB(user: Auth) {
    this.http.put(`${firebaseConfig.databaseURL}/v1/users/${user.uid}.json`,JSON.stringify(user),HEADER)
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