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

  loadCollection(id: string) {
    this.http.get(`${firebaseConfig.databaseURL}/v1/collection.json?orderBy="owner/uid"&equalTo="${id}"`)
      .map(res => res.json())
      .map(games => {
        console.log(games);
        return games
      })
      .map(payload => ({ type: 'POPULATE_COLLECTION', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGame(game: Game) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/collection.json`, JSON.stringify(game), HEADER)
      .map(game => {
        console.log(game);
        return game;
      })
      .map(payload => ({ type: 'CREATE_GAME', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameInGameNightCollection(game: Game, id: string) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights/${id}/collection.json`, JSON.stringify(game), HEADER)
      .map(res => {
        console.log(game);
        return game;
      })
      .map(payload => ({ type: 'CREATE_GAME_IN_GAME_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameInGameNightAndMyCollection(game: Game, id: string) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/collection.json`, JSON.stringify(game), HEADER)
      .map(res => {
        console.log(res);
        this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights/${id}/collection.json`, JSON.stringify(game), HEADER)
          .map(res => ({ type: 'CREATE_GAME_IN_GAME_NIGHT', game }))
          .subscribe(action => this.store.dispatch(action));
        return game;
      })
      .map(payload => ({ type: 'CREATE_GAME', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}