import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {firebaseConfig} from '../constants/firebaseConfig';
import {GameNight} from '../models/game-night.model';
import {Auth, IAuth} from '../models/auth.model';
import {AuthService} from './auth.service';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class GameNightService {

  gameNight: Observable<GameNight>;
  myGameNights: Observable<Array<GameNight>>;

  constructor(private store: Store<AppStore>, private http: Http, private authService: AuthService) {
    this.gameNight = store.select("gameNight");
    this.myGameNights = store.select("myGameNights");
  }

  loadGameNight() {
    this.http.get(`${firebaseConfig.databaseURL}/v1/game-nights.json?orderBy=id&equalTo=${this.authService.getCurrentUser()}`)
      .map(res => res.json())
      .map(gameNight => {
        // Map the Id from Firebase to each member's Id
        return Object.keys(gameNight).map((val => {
          var night = new GameNight(gameNight[val]);
          night.id = val;
          return night;
        }))[0]
      })
      .map(payload => ({ type: 'POPULATE_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  loadMyGameNights() {
    var uid = this.authService.getCurrentUser();
    this.http.get(`${firebaseConfig.databaseURL}/v1/game-nights.json?orderBy="hosts"&startAt="${uid}"`)
      .map(res => res.json())
      .map(gameNights => {
        // Map the Id from Firebase to each night's Id
        return Object.keys(gameNights).map((val => {
          var night = new GameNight(gameNights[val]);
          night.id = val;
          // Map the Id from Firebase to each host's Id
          night.hosts = Object.keys(gameNights[val].hosts).map((val2 => {
            var auth = new Auth(gameNights[val].hosts[val2]);
            auth.uid = val2;
            return auth;
          }))
          // // Map the Id from Firebase to each member's Id
          // night.members = Object.keys(gameNights[val].members).map((val2 => {
          //   var auth = new Auth(gameNights[val].members[val2]);
          //   auth.uid = val2;
          //   return auth;
          // }))
          return night;
        }))
      })
      .map(payload => ({ type: 'POPULATE_NIGHTS', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameNight(night: GameNight) {
    night = this.packageGameNight(night);
    this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights.json`, JSON.stringify(night), HEADER)
      .map(res => {
        // Firebase Id is returned, add it to the member object
        night.id = res.json().name;
        return night;
      })
      .map(payload => ({ type: 'CREATE_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  // Package Auth object for Firebase
  // Need to convert any typed arrays to objects using the FB key
  packageGameNight(night: GameNight):any {
    var output = {
      name: night.name,
      hosts: {}
    }
    night.hosts.forEach((auth: IAuth) => {
      output.hosts[auth.uid] = auth;
    })
    return output;
  }
}