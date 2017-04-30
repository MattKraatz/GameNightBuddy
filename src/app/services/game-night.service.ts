import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {firebaseConfig} from '../constants/firebaseConfig';
import {GameNight} from '../models/game-night.model';
import {Game} from '../models/game.model';
import {Auth, IAuth} from '../models/auth.model';
import {AuthService} from './auth.service';
import {Member} from '../models/member.model';
import {Match} from '../models/match.model';
import {Player} from '../models/player.model';
import {ServerConfig} from '../constants/serverConfig';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class GameNightService {

  gameNight: Observable<GameNight>;
  myGameNights: Observable<Array<GameNight>>;

  nightLoaded: boolean = false;
  nightsLoaded: boolean = false;  

  constructor(private store: Store<AppStore>, private http: Http, private authService: AuthService) {
    this.gameNight = store.select("gameNight");
    this.myGameNights = store.select("myGameNights");
  }

  loadGameNight(id: string) {
    if (!this.nightLoaded) {
      this.http.get(`${firebaseConfig.databaseURL}/v1/game-nights/${id}.json`)
        .map(res => res.json())
        .map(gameNight => {
          var night = new GameNight(gameNight);
          return night;
        })
        .map(payload => ({ type: 'POPULATE_NIGHT', payload }))
        .subscribe(action => this.store.dispatch(action));
    }
    this.nightLoaded = true;
  }

  loadMyGameNights(id: string) {
    if (!this.nightsLoaded) {
      this.http.get(`${ServerConfig.baseUrl}/game-nights`)
        .map(res => res.json())
        .subscribe(payload => {
          console.log(payload);
          this.store.dispatch({ type: 'POPULATE_MY_NIGHTS', payload: payload })
      });
    }
    this.nightsLoaded = true;
  }

  createGameNight(night: GameNight) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights.json`, JSON.stringify(night), HEADER)
      .map(payload => ({ type: 'CREATE_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}