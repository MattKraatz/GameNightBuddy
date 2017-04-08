import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Match} from '../models/match.model';
import {firebaseConfig} from '../constants/firebaseConfig';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class MatchService {
  
  matches: Observable<Array<Match>>;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.matches = store.select('matches');
  }

  loadMatches() {
    this.http.get(`${firebaseConfig.databaseURL}/v1/matches.json`)
      .map(res => res.json())
      .map(matches => {
        // Map the Id from Firebase to each match's Id
        return Object.keys(matches).map((val => {
          var match = new Match(matches[val]);
          match.id = val;
          return match;
        }))
      })
      .map(payload => ({ type: 'POPULATE_MATCHES', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createMatch(match: Match) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/matches.json`, JSON.stringify(match), HEADER)
      .map(res => {
        // UUID is returned, add it to the match object
        match.id = res.json().name;
        return match;
      })
      .map(payload => ({ type: 'CREATE_MATCH', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}