import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Match} from '../models/match.model';
import {firebaseConfig} from '../constants/firebaseConfig';
import {Player} from '../models/player.model';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class MatchService {
  
  matches: Observable<Array<Match>>;
  
  matchesLoaded: boolean = false;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.matches = store.select('matches');
  }

  // not getting used currently
  loadMatches(id: string) {
    this.http.get(`${firebaseConfig.databaseURL}/v1/game-nights/${id}/matches.json`)
      .map(res => res.json())
      .map(matches => {
        console.log(matches);
        return matches;
      })
      .map(payload => ({ type: 'POPULATE_MATCHES', payload }))
      .subscribe(action => {
        this.store.dispatch(action)
        this.matchesLoaded = true;
      });
  }

  createMatch(match: Match, id: string) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights/${id}/matches.json`, JSON.stringify(match), HEADER)
      .map(res => {
        console.log(match)
        return match;
      })
      .map(payload => ({ type: 'CREATE_MATCH_IN_GAME_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}