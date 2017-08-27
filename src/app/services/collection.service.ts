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
import {NavbarService} from '../services/navbar.service';


@Injectable()
export class CollectionService {
  
  collection: Observable<Array<Game>>;
  gameRecommendations: BehaviorSubject<Array<Game>>;
  
  constructor(private store: Store<AppStore>, private http: Http,
              private gameNightService: GameNightService, private authService: AuthService,
              private navbarService: NavbarService) {
    this.collection = store.select('collection');
    this.gameRecommendations = new BehaviorSubject<Array<Game>>(new Array<Game>());
  }

  loadCollection(id: string) {
    this.navbarService.isContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.get(`${ServerConfig.baseUrl}/games/my`, options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.COLLECTION_POPULATE, payload }))
      .subscribe(action => {
        this.navbarService.isContentLoading.next(false);
        this.store.dispatch(action);
      });
  }

  createGame(game: Game) {
    this.navbarService.isContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/games`, JSON.stringify(game), options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.COLLECTION_CREATE_GAME, payload }))
      .subscribe(action => {
        this.navbarService.isContentLoading.next(false);
        this.store.dispatch(action);
      });
  }

  createGameInGameNightAndMyCollection(game: Game, nightId: string) {
    this.navbarService.isGameNightContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/games/${nightId}`, game, options)
      .map(res => res.json())
      .subscribe(payload => {
        this.navbarService.isGameNightContentLoading.next(false);
        this.store.dispatch({ type: StoreActions.COLLECTION_CREATE_GAME, payload });
        this.store.dispatch({ type: StoreActions.GAME_NIGHT_CREATE_GAME, payload });
    })
  }

  addGameToGameNight(game: Game, nightId: string) {
    this.navbarService.isGameNightContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/game-nights/${nightId}/games`, game, options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.GAME_NIGHT_CREATE_GAME, payload }))
      .subscribe(action => {
        this.navbarService.isGameNightContentLoading.next(false);
        this.store.dispatch(action);
      });
  }

  updateGame(game: Game) {
    this.navbarService.isContentLoading.next(true);
    this.navbarService.isGameNightContentLoading.next(true);    
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.put(`${ServerConfig.baseUrl}/games`, game, options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.UPDATE_GAME, payload }))
      .subscribe(action => {
        this.navbarService.isContentLoading.next(false);
        this.navbarService.isGameNightContentLoading.next(false);
        this.store.dispatch(action);
      });
  }

  updateGameRating(rating: GameRating) {
    this.navbarService.isContentLoading.next(true);
    this.navbarService.isGameNightContentLoading.next(true);  
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.put(`${ServerConfig.baseUrl}/games/rating`, rating, options)
      .subscribe(res => {
        this.navbarService.isContentLoading.next(false);
        this.navbarService.isGameNightContentLoading.next(false);
      });
  }

  getGameRecommendation(members: Member[]){
    this.navbarService.isGameNightContentLoading.next(true);

    var request = new GameRecRequest();
    request.GameNightId = this.gameNightService.currentGameNight.value.GameNightId;
    request.UserIds = members.map(m => m.UserId);

    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/games/recommend`, request, options)
    .map(res => res.json())
    .subscribe(games => {
      this.navbarService.isGameNightContentLoading.next(false);
      this.gameRecommendations.next(games)
    });
  }

  deleteGame(gameId: string){
    this.navbarService.isGameNightContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.delete(`${ServerConfig.baseUrl}/games/${gameId}`, options)
      .subscribe(res => {
        this.navbarService.isGameNightContentLoading.next(false);        
        this.store.dispatch({type: StoreActions.COLLECTION_DELETE_GAME, payload: gameId});
        this.store.dispatch({type: StoreActions.GAME_NIGHT_DELETE_GAME, payload: gameId});
      })
  }
}