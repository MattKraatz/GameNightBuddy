import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from "rxjs";
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
import {GameRecRequest} from '../models/game-rec-request.model';
import {AuthService} from '../services/auth.service';
import {GameNightService} from '../services/game-night.service';
import {HttpOptions} from '../models/http-options.model';


@Injectable()
export class CollectionService {
  
  collection: Observable<Array<Game>>;
  gameRecommendations: BehaviorSubject<Array<Game>>;
  
  constructor(private store: Store<AppStore>, private http: Http,
              private gameNightService: GameNightService, private authService: AuthService) {
    this.collection = store.select('collection');
    this.gameRecommendations = new BehaviorSubject<Array<Game>>(new Array<Game>());
  }

  loadCollection(id: string) {
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.get(`${ServerConfig.baseUrl}/games/my`, options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.COLLECTION_POPULATE, payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGame(game: Game) {
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/games`, JSON.stringify(game), options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.COLLECTION_CREATE_GAME, payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createGameInGameNightAndMyCollection(game: Game, nightId: string) {
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/games/${nightId}`, game, options)
      .map(res => res.json())
      .subscribe(payload => {
        this.store.dispatch({ type: StoreActions.COLLECTION_CREATE_GAME, payload });
        this.store.dispatch({ type: StoreActions.GAME_NIGHT_CREATE_GAME, payload });
    })
  }

  addGameToGameNight(game: Game, nightId: string) {
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/game-nights/${nightId}/games`, game, options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.GAME_NIGHT_CREATE_GAME, payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  updateGame(game: Game) {
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.put(`${ServerConfig.baseUrl}/games`, game, options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.UPDATE_GAME, payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  updateGameRating(rating: GameRating) {
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.put(`${ServerConfig.baseUrl}/games/rating`, rating, options)
      .subscribe(res => res.json());
  }

  getGameRecommendation(members: Member[]){
    var request = new GameRecRequest();
    request.GameNightId = this.gameNightService.currentGameNight.value.GameNightId;
    request.UserIds = members.map(m => m.UserId);

    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/games/recommend`, request, options)
    .map(res => {
      return res.json();
    })
    .subscribe(games => this.gameRecommendations.next(games));
  }
}