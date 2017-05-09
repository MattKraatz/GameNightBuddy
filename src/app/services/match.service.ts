import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Match} from '../models/match.model';
import {ServerConfig} from '../constants/serverConfig';
import {Player} from '../models/player.model';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class MatchService {
  
  matches: Observable<Array<Match>>;
  
  matchesLoaded: boolean = false;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.matches = store.select('matches');
  }

  createMatch(match: Match, id: string) {
    this.http.post(`${ServerConfig.baseUrl}/game-nights/${id}/matches`, JSON.stringify(match), HEADER)
      .map(res => {
        return match;
      })
      .map(payload => ({ type: 'CREATE_MATCH_IN_GAME_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}