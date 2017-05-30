import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers, RequestOptions} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Match} from '../models/match.model';
import {ServerConfig} from '../constants/serverConfig';
import {Player} from '../models/player.model';
import {Game} from '../models/game.model';
import {GameNight} from '../models/game-night.model';
import {StoreActions} from '../constants/storeActions';

const HEADERS = new Headers({ 'Content-Type': 'application/json' });
const OPTIONS = new RequestOptions({ headers: HEADERS });

@Injectable()
export class MatchService {
  
  matches: Observable<Array<Match>>;
  
  matchesLoaded: boolean = false;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.matches = store.select('matches');
  }

  createMatch(match: Match, id: string) {
    // remove circular references
    match.Game.Owner.Games = new Array<Game>();
    match.Game.Owner.GameNights = new Array<GameNight>();
    match.Players = match.Players.map(p => {
      p.GameNights = new Array<GameNight>();
      p.Games = new Array<Game>();
      return p;
    });

    this.http.post(`${ServerConfig.baseUrl}/game-nights/${id}/matches`, JSON.stringify(match), OPTIONS)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.GAME_NIGHT_CREATE_MATCH, payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}