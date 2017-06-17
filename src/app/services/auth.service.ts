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
import {StoreActions} from '../constants/storeActions';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class AuthService {
  
  user: Observable<Auth>;
  currentUser: Auth;

  userProfile: Observable<User>;
  currentUserProfile: User;
  public userLoaded: boolean = false;

  public isUserLoading: Subject<boolean> = new Subject<boolean>();

  userSearch: Observable<User[]>;
  
  constructor(public af: AngularFire, private store: Store<AppStore>, private http: Http,
      private router: Router) {
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
        this.isUserLoading.next(false);
        this.store.dispatch({type: "LOGOUT_USER", payload: new User()});
      }
    })
  }

  getAuthRecordFromDB(auth: Auth) {
    this.isUserLoading.next(true);
    this.http.get(`${ServerConfig.baseUrl}/users/${auth.uid}`)
        .map(res => res.json())
        .map(res => {
          var user = new User(res);
          this.currentUserProfile = user;
          this.userLoaded = true;
          return user;
        })
        .map(user => {
          return {type: StoreActions.LOGIN_USER, payload: user}
        })
        .subscribe(action => {
          this.isUserLoading.next(false);
          this.store.dispatch(action)
        });
  }

  searchUsers(query: string, nightId: string): Observable<User[]> {
    return this.http.get(`${ServerConfig.baseUrl}/users/search/${nightId}/${query}`,HEADER)
      .map(res => res.json())
  }

  updateUserInDB(user: User) {
    this.http.put(`${ServerConfig.baseUrl}/users`,JSON.stringify(user),HEADER)
      .map(res => ({ type: 'LOGIN_USER', payload: user }))
      .subscribe(action => this.store.dispatch(action));
  }

  loginWithFacebook() {
    // Redirect Method (default) reloads the page, triggering the constructor
    this.af.auth.login();
  }

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
    // Remove circular reference
    user.Games = new Array<Game>();
    user.GameNights = new Array<GameNight>();
    return user;
  }

}