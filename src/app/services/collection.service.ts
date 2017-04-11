import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Game} from '../models/game.model';
import {firebaseConfig} from '../constants/firebaseConfig';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class CollectionService {
  
  collection: Observable<Array<Game>>;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.collection = store.select('collection');
  }

  loadCollection() {
    this.http.get(`${firebaseConfig.databaseURL}/v1/collection.json`)
      .map(res => res.json())
      .map(games => {
        // Map the Id from Firebase to each game's Id
        return Object.keys(games).map((val => {
          var game = new Game(games[val]);
          game.id = val;
          return game;
        }))
      })
      .map(payload => ({ type: 'POPULATE_COLLECTION', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGame(game: Game) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/collection.json`, JSON.stringify(game), HEADER)
      .map(res => {
        // UUID is returned, add it to the game object
        game.id = res.json().name;
        return game;
      })
      .map(payload => ({ type: 'CREATE_GAME', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameInGameNightCollection(game: Game, id: string) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights/${id}/collection.json`, JSON.stringify(game), HEADER)
      .map(res => {
        // UUID is returned, add it to the game object
        game.id = res.json().name;
        return game;
      })
      .map(payload => ({ type: 'CREATE_GAME_IN_GAME_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameInGameNightAndMyCollection(game: Game, id: string) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/collection.json`, JSON.stringify(game), HEADER)
      .map(res => {
        // UUID is returned, add it to the game object
        game.id = res.json().name;
        this.http.put(`${firebaseConfig.databaseURL}/v1/game-nights/${id}/collection/${game.id}.json`, JSON.stringify(game), HEADER)
          .map(res => game)
          .map(payload => ({ type: 'CREATE_GAME_IN_GAME_NIGHT', payload }))
          .subscribe(action => this.store.dispatch(action));
        return game;
      })
      .map(payload => ({ type: 'CREATE_GAME', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}