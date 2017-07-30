import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers, RequestOptions} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Match} from '../models/match.model';
import {ServerConfig} from '../constants/serverConfig';
import {Player} from '../models/player.model';
import {Game} from '../models/game.model';
import {GameNight} from '../models/game-night.model';
import {StoreActions} from '../constants/storeActions';
import {HttpOptions} from '../models/http-options.model';
import {AuthService} from '../services/auth.service';

@Injectable()
export class MatchService {
  
  matches: Observable<Array<Match>>;
  
  matchesLoaded: boolean = false;
  
  constructor(private store: Store<AppStore>, private http: Http, private authService: AuthService) {
    this.matches = store.select('matches');
  }

  createMatch(match: Match, nightId: string) {
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/game-nights/${nightId}/matches`, JSON.stringify(match), options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.GAME_NIGHT_CREATE_MATCH, payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  updateMatch(match: Match, nightId: string) {
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.put(`${ServerConfig.baseUrl}/game-nights/${nightId}/matches`, JSON.stringify(match), options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.GAME_NIGHT_UPDATE_MATCH, payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}