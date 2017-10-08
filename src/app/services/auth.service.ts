import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {AngularFireAuth} from 'angularfire2/auth';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';
import * as firebase from 'firebase';

import {AppStore, IStoreAction} from '../models/appstore.model';
import {Auth} from '../models/auth.model';
import {User} from '../models/user.model';
import {Game} from '../models/game.model';
import {GameNight} from '../models/game-night.model';
import {LoginViewModel} from '../viewmodels/login.viewmodel';
import {ServerConfig} from '../constants/serverConfig';
import {StoreActions} from '../constants/storeActions';
import {NavbarService} from '../services/navbar.service';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class AuthService {
  
  user: Observable<Auth>;
  currentUser: Auth;

  userProfile: Observable<User>;
  currentUserProfile: User;
  userLoaded: boolean = false;

  emailLoginError: Subject<string> = new Subject<string>();
  emailRegisterError: Subject<string> = new Subject<string>();

  userSearch: Observable<User[]>;
  
  constructor(public af: AngularFireAuth, private store: Store<AppStore>, private http: Http,
      private router: Router, private navbarService: NavbarService) {
    this.user = store.select("auth");
    this.userProfile = store.select("user");
    this.user.subscribe(auth => this.currentUser = auth);

    // Resolve initial Auth status
    this.af.auth.onAuthStateChanged(auth => {
      if(auth && auth.providerData && auth.providerData[0]) {
        // user logged in
        if (auth.providerData[0].providerId === 'facebook.com') {
          var user = new Auth(auth.providerData[0]);
          user.uid = auth.uid;
          this.getAuthRecordFromDB(user);
        } else if (auth.providerData[0].providerId === 'password') {
          var user = new Auth(auth.providerData[0]);
          this.getAuthRecordFromDB(user);
        }
      }
      else {
        // user not logged in
        this.navbarService.isContentLoading.next(false);
      }
    })
  }

  getAuthRecordFromDB(auth: Auth) {
    this.navbarService.isContentLoading.next(true);
    this.http.post(`${ServerConfig.baseUrl}/users`, JSON.stringify(auth), HEADER)
        .map(res => res.json())
        .map(json => {
          var user = new User(json);
          this.userLoaded = true;
          return this.currentUserProfile = user;
        })
        .subscribe(user => {
          var action = {type: StoreActions.LOGIN_USER, payload: user};
          this.navbarService.isContentLoading.next(false);
          this.store.dispatch(action);
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
    this.af.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(response => {
        // try to navigate to 'my game nights' after the userProfile is updated
        // profile complete guard service will catch an incomplete profile
        this.userProfile.subscribe(u => {
          if (u.UserId !== '') this.router.navigate(['my-game-nights']);
        });
      });
  }

  loginWithEmailAndPassword(user: LoginViewModel) {
    this.af.auth.signInWithEmailAndPassword(user.Email, user.Password)
    .then(response => {
      // try to navigate to 'my game nights' after the userProfile is updated
      // profile complete guard service will catch an incomplete profile
      this.userProfile.first().subscribe(u => {
        this.router.navigate(['my-game-nights']);
      }).unsubscribe();
    })
    .catch(response => {
      // invalid login
      this.emailLoginError.next(response.message);
    });
  }

  registerEmailAndPassword(user: LoginViewModel) {
    this.af.auth.createUserWithEmailAndPassword(user.Email, user.Password)
    .then(response => {
      this.userProfile.first().subscribe(u => {
        this.router.navigate(['my-game-nights']);
      })
    })
    .catch(response => {
      // invalid registration
      this.emailRegisterError.next(response.message);
    });
  }

  logout() {
    this.af.auth.signOut()
      .then(response => {
        this.store.dispatch({type: "LOGOUT_USER", payload: null});
        this.router.navigate(['/']);
      });
  }

  validateProfile(user: User): boolean {
      var output = false;
      if (user.FirstName && user.FirstName.length > 0 &&
          user.LastName && user.LastName.length > 0 &&
          user.Email && user.Email.length > 0 &&          
          user.DisplayName && user.DisplayName.length > 0) {
            output = true;
          } else {
            this.router.navigate(['profile']);
          }
      return output;
    }

}