import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Game} from '../models/game.model';
import {Member} from '../models/member.model';
import {firebaseConfig} from '../firebaseConfig';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class CollectionService {
  
  collection: Observable<Array<Game>>;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.collection = store.select('collection'); // Bind an observable of our members to "MembersService"
  }

  loadCollection() {
    this.http.get(`${firebaseConfig.databaseURL}/v1/collection.json`)
      .map(res => res.json())
      .map(games => {
        // Sanitize Firebase return
        console.dir(games);
        return Object.keys(games).map((val => new Game(val, games[val].name, new Member(games[val].owner.id, games[val].owner.firstName, games[val].owner.lastName, games[val].owner.email), games[val].minPlayers, games[val].maxPlayers)))
      })
      .map(payload => ({ type: 'POPULATE_COLLECTION', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGame(game: Game) {
    console.log(game);
    console.log(JSON.stringify(game))
    this.http.post(`${firebaseConfig.databaseURL}/v1/collection.json`, JSON.stringify(game), HEADER)
      .map(res => {
        // UUID is returned, add it to the game object
        game.id = res.json().name;
        return game;
      })
      .map(payload => ({ type: 'CREATE_GAME', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}