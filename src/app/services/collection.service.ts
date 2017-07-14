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
import {GameRating} from '../models/game-rating.model';
import {StoreActions} from '../constants/storeActions';
import {Member} from '../models/member.model';

const HEADERS = new Headers({ 'Content-Type': 'application/json' });
const OPTIONS = new RequestOptions({ headers: HEADERS });

@Injectable()
export class CollectionService {
  
  collection: Observable<Array<Game>>;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.collection = store.select('collection');
  }

  loadCollection(id: string) {
    this.http.get(`${ServerConfig.baseUrl}/games/my/${id}`)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.COLLECTION_POPULATE, payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGame(game: Game) {
    this.http.post(`${ServerConfig.baseUrl}/games`, JSON.stringify(game), OPTIONS)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.COLLECTION_CREATE_GAME, payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameInGameNightAndMyCollection(game: Game, id: string) {
    this.http.post(`${ServerConfig.baseUrl}/games/${id}`, game, OPTIONS)
      .map(res => res.json())
      .subscribe(payload => {
        this.store.dispatch({ type: StoreActions.COLLECTION_CREATE_GAME, payload })
        this.store.dispatch({ type: StoreActions.GAME_NIGHT_CREATE_GAME, payload })
    })
  }

  addGameToGameNight(game: Game, nightId: string) {
    this.http.post(`${ServerConfig.baseUrl}/game-nights/${nightId}/games`, game, OPTIONS)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.GAME_NIGHT_CREATE_GAME, payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  updateGame(game: Game) {
    this.http.put(`${ServerConfig.baseUrl}/games`, game, OPTIONS)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.UPDATE_GAME, payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  updateGameRating(rating: GameRating) {
    this.http.put(`${ServerConfig.baseUrl}/games/rating`, rating, OPTIONS)
      .subscribe(res => res.json());
  }

  getGameRecommendation(members: Member[]){
    console.log("I'm not doing anything with this yet", members);
  }
}