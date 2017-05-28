import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers, RequestOptions} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Game} from '../models/game.model';
import {firebaseConfig} from '../constants/firebaseConfig';
import {ServerConfig} from '../constants/serverConfig';
import {User} from '../models/user.model';

const HEADERS = new Headers({ 'Content-Type': 'application/json' });
const OPTIONS = new RequestOptions({ headers: HEADERS });

@Injectable()
export class CollectionService {
  
  collection: Observable<Array<Game>>;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.collection = store.select('collection');
  }

  loadCollection(id: string) {
    this.http.get(`${ServerConfig.baseUrl}/games/${id}`)
      .map(res => res.json())
      .map(games => {
        return games
      })
      .map(payload => ({ type: 'POPULATE_COLLECTION', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGame(game: Game) {
    this.http.post(`${ServerConfig.baseUrl}/games`, JSON.stringify(game), OPTIONS)
      .map(game => {
        return game;
      })
      .map(payload => ({ type: 'CREATE_GAME', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameInGameNightCollection(game: Game, id: string) {
    this.http.post(`${ServerConfig.baseUrl}/v1/game-nights/${id}/collection.json`, JSON.stringify(game), OPTIONS)
      .map(res => {
        return game;
      })
      .map(payload => ({ type: 'CREATE_GAME_IN_GAME_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameInGameNightAndMyCollection(game: Game, id: string) {
    this.http.post(`${ServerConfig.baseUrl}/games/${id}`, game, OPTIONS)
      .map(res => {
        return res;
      })
      .map(payload => ({ type: 'CREATE_GAME', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  addGameToGameNight(game: Game, nightId: string) {
    this.http.post(`${ServerConfig.baseUrl}/game-nights/${nightId}/games`, game, OPTIONS)
      .map(res => {
        return res;
      })
      .map(payload => ({ type: 'CREATE_GAME_IN_GAME_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}