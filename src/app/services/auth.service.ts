import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';

import {AppStore, IStoreAction} from '../models/appstore.model';
import {Auth} from '../models/auth.model';
import {User} from '../models/user.model';
import {Game} from '../models/game.model';
import {GameNight} from '../models/game-night.model';
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

  userSearch: Observable<User[]>;
  
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

  getAuthRecordFromDB(auth: Auth) {
    this.http.get(`${ServerConfig.baseUrl}/users/${auth.uid}`)
        .map(res => res.json())
        .map(res => {
          var user = new User(res);
          console.log(res);
          this.currentUserProfile = user;
          this.userLoaded = true;
          return user;
        })
        .map(payload => ({ type: 'LOGIN_USER', payload }))
        .subscribe(action => {
          this.store.dispatch(action);
          this.userLoaded = true;
        });
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get(`${ServerConfig.baseUrl}/users/search/${query}`,HEADER)
      .map(res => res.json())
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
    console.log(user);
    this.af.auth.login({
      email: user.Email,
      password: user.Password
    },
    {
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    })
    .then(response => {
      var user = new Auth(response.auth);
      this.getAuthRecordFromDB(user);
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
      var user = new Auth(response.auth);      
      this.getAuthRecordFromDB(user);
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

  getCurrentUserProfile(): User {
    var user = this.currentUserProfile;
    user.Games = new Array<Game>();
    user.GameNights = new Array<GameNight>();
    return user;
  }

}