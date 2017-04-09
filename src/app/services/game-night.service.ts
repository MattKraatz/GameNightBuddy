import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {firebaseConfig} from '../constants/firebaseConfig';
import {GameNight} from '../models/game-night.model';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class GameNightService {

  gameNight: Observable<GameNight>;
  myGameNights: Observable<Array<GameNight>>;

  constructor(private store: Store<AppStore>, private http: Http) {
    this.gameNight = store.select("gameNight");
    this.myGameNights = store.select("myGameNights");
  }

  loadGameNight(id: string) {
    this.http.get(`${firebaseConfig.databaseURL}/v1/game-nights.json?orderBy=id&equalTo=${id}`)
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
    this.http.get(`${firebaseConfig.databaseURL}/v1/game-nights.json`)
      .map(res => res.json())
      .map(gameNights => {
        console.log(gameNights);
        // Map the Id from Firebase to each member's Id
        return Object.keys(gameNights).map((val => {
          var night = new GameNight(gameNights[val]);
          night.id = val;
          return night;
        }))
      })
      .map(payload => ({ type: 'POPULATE_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameNight(night: GameNight) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights.json`, JSON.stringify(night), HEADER)
      .map(res => {
        // Firebase Id is returned, add it to the member object
        night.id = res.json().name;
        return night;
      })
      .map(payload => ({ type: 'CREATE_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}
