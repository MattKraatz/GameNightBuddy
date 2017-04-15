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
        // Map the Id from Firebase to each match's Id
        return Object.keys(matches).map((val => {
          var match = new Match(matches[val]);
          match.id = val;
          return match;
        }))
      })
      .map(payload => ({ type: 'POPULATE_MATCHES', payload }))
      .subscribe(action => {
        this.store.dispatch(action)
        this.matchesLoaded = true;
      });
  }

  // package the match object for firebase
  // replace the array of players with an object of player uid keys
  createMatch(match: Match, id: string) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights/${id}/matches.json`, JSON.stringify(this.packageMatch(match)), HEADER)
      .map(res => {
        // UUID is returned, add it to the match object
        match.id = res.json().name;
        return match;
      })
      .map(payload => ({ type: 'CREATE_MATCH_IN_GAME_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  // Package Match object for Firebase
  // Need to convert any typed arrays to objects using the FB key
  packageMatch(match: Match) {
    var output = {
      date: match.date,
      game: match.game,
      players: {}
    };
    match.players.forEach((player: Player) => {
      output.players[player.uid] = player;
    })
    return output;
  }
}