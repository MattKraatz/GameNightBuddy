import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers, RequestOptions} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {firebaseConfig} from '../constants/firebaseConfig';
import {GameNight} from '../models/game-night.model';
import {Game} from '../models/game.model';
import {Auth, IAuth} from '../models/auth.model';
import {AuthService} from './auth.service';
import {Member} from '../models/member.model';
import {User} from '../models/user.model';
import {Match} from '../models/match.model';
import {Player} from '../models/player.model';
import {ServerConfig} from '../constants/serverConfig';
import {StoreActions} from '../constants/storeActions';
import {HttpOptions} from '../models/http-options.model';
import {Activity} from '../models/activity.model';
import {NavbarService} from './navbar.service';

@Injectable()
export class GameNightService {

  gameNight: Observable<GameNight>;
  myGameNights: Observable<Array<GameNight>>;
  otherGameNights: Observable<Array<GameNight>>;

  nightLoaded: boolean = false;
  nightsLoaded: boolean = false;
  otherNightsLoaded: boolean = false;
  isHost: boolean = false;
  activityLoaded: BehaviorSubject<boolean>;
  isMyGameNightsLoading: BehaviorSubject<boolean>;
  isOtherGameNightsLoading: BehaviorSubject<boolean>;

  currentGameNight: BehaviorSubject<GameNight>;

  constructor(private store: Store<AppStore>, private http: Http, private authService: AuthService,
              private navbarService: NavbarService) {
    this.gameNight = store.select("gameNight");
    this.myGameNights = store.select("myGameNights");
    this.otherGameNights = store.select("otherGameNights");

    this.activityLoaded = new BehaviorSubject<boolean>(false);
    this.isMyGameNightsLoading = new BehaviorSubject<boolean>(false);
    this.isOtherGameNightsLoading = new BehaviorSubject<boolean>(false);

    this.gameNight.subscribe(n => {
      if (this.currentGameNight == undefined) {
        this.currentGameNight = new BehaviorSubject(n);
      } else {
        this.currentGameNight.next(n);
      }
      var user = this.authService.currentUserProfile;
      this.isHost = n.Members.findIndex(m => m.IsHost && m.UserId === user.UserId) > -1;
    })
  }

  loadGameNight(id: string) {
    if (this.activityLoaded.value) this.activityLoaded.next(false);
    this.navbarService.isContentLoading.next(true);

    if (!this.nightLoaded || id != this.currentGameNight.value.GameNightId) {
      if (this.nightLoaded) this.store.dispatch({type: StoreActions.GAME_NIGHT_DELETE, payload: {}});
      
      var options = new HttpOptions(this.authService.currentUserProfile.UserId);  
      this.http.get(`${ServerConfig.baseUrl}/game-nights/${id}`, options)
        .map(res => res.json())
        .map(payload => ({type: StoreActions.GAME_NIGHT_POPULATE_NIGHT, payload}))
        .subscribe(action => {
          this.navbarService.isContentLoading.next(false);
          this.store.dispatch(action)
        });
    }
    this.nightLoaded = true;
  }

  refreshGameNight() {
    if (this.nightLoaded) {
      this.navbarService.isGameNightContentLoading.next(true);  
      var options = new HttpOptions(this.authService.currentUserProfile.UserId);  
      this.http.get(`${ServerConfig.baseUrl}/game-nights/${this.currentGameNight.value.GameNightId}`, options)
        .map(res => res.json())
        .map(payload => ({ type: StoreActions.GAME_NIGHT_POPULATE_NIGHT, payload }))
        .subscribe(action => {
          this.navbarService.isGameNightContentLoading.next(false);      
          this.store.dispatch(action)
        });
    }
  }

  loadMyGameNights() {
    if (!this.nightsLoaded) {
      this.navbarService.isContentLoading.next(true);
      this.isMyGameNightsLoading.next(true);
      var options = new HttpOptions(this.authService.currentUserProfile.UserId);  
      this.http.get(`${ServerConfig.baseUrl}/game-nights/my`, options)
        .map(res => res.json())
        .subscribe(payload => {
          this.navbarService.isContentLoading.next(false);
          this.isMyGameNightsLoading.next(false);
          this.store.dispatch({ type: StoreActions.MY_GAME_NIGHTS_POPULATE, payload })
        });
    }
    this.nightsLoaded = true;
  }

  loadOtherGameNights(id: string) {
    if (!this.otherNightsLoaded) {
      this.navbarService.isContentLoading.next(true);
      this.isOtherGameNightsLoading.next(true);
      var options = new HttpOptions(this.authService.currentUserProfile.UserId);
      this.http.get(`${ServerConfig.baseUrl}/game-nights/explore`, options)
        .map(res => res.json())
        .subscribe(payload => {
          this.navbarService.isContentLoading.next(false); 
          this.isOtherGameNightsLoading.next(false);
          this.store.dispatch({ type: StoreActions.OTHER_GAME_NIGHTS_POPULATE, payload: payload })
        });
    }
    this.otherNightsLoaded = true;
  }

  refreshOtherGameNights(id: string) {
    if (this.otherNightsLoaded) {
      this.navbarService.isContentLoading.next(true);
      var options = new HttpOptions(this.authService.currentUserProfile.UserId);
      this.http.get(`${ServerConfig.baseUrl}/game-nights/explore`, options)
        .map(res => res.json())
        .subscribe(payload => {
          this.navbarService.isContentLoading.next(false);
          this.store.dispatch({ type: StoreActions.OTHER_GAME_NIGHTS_POPULATE, payload: payload })
        });
    }
    this.otherNightsLoaded = true;
  }

  createGameNight(night: GameNight) {
    this.navbarService.isContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/game-nights`, JSON.stringify(night), options)
      .map(res => res.json())
      .map(payload => ({ type: StoreActions.MY_GAME_NIGHTS_CREATE, payload }))
      .subscribe(action => {
        this.navbarService.isContentLoading.next(false);
        this.store.dispatch(action)
      });
  }

  joinGameNight(user: User, night: GameNight) {
    this.navbarService.isContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/game-nights/${night.GameNightId}/members`, JSON.stringify(user), options)
      .map(res => res.json())
      .subscribe(payload => {
        this.navbarService.isContentLoading.next(false);    
        this.store.dispatch({ type: StoreActions.OTHER_GAME_NIGHTS_JOIN, payload: night });
      });
  }

  addGameNightMember(user: User, nightId: string) {
    this.navbarService.isGameNightContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.post(`${ServerConfig.baseUrl}/game-nights/${nightId}/members`, JSON.stringify(user), options)
      .map(res => res.json())      
      .subscribe(payload => {
        this.navbarService.isGameNightContentLoading.next(false);    
        this.store.dispatch({ type: StoreActions.GAME_NIGHT_CREATE_MEMBER, payload });
      });
  }

  updateGameNightMember(member: Member, nightId: string) {
    this.navbarService.isGameNightContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.put(`${ServerConfig.baseUrl}/game-nights/${nightId}/members`, JSON.stringify(member), options)
      .map(res => res.json())
      .subscribe(payload => {
        this.navbarService.isGameNightContentLoading.next(false);    
        this.store.dispatch({ type: StoreActions.GAME_NIGHT_UPDATE_MEMBER, payload });
      });
  }

  getNotifications(nightId: string) {
    this.navbarService.isGameNightContentLoading.next(true);
    var options = new HttpOptions(this.authService.currentUserProfile.UserId);
    this.http.get(`${ServerConfig.baseUrl}/game-nights/${nightId}/notifications`, options)
      .map(res => res.json())
      .map(res => this.populateActivityEntities(res))
      .subscribe(payload => {
        this.navbarService.isGameNightContentLoading.next(false);    
        this.activityLoaded.next(true);
        this.store.dispatch({ type: StoreActions.GAME_NIGHT_POPULATE_NOTIFICATIONS, payload: payload })
      });
  }

  private populateActivityEntities(activities: Activity[]){
    activities.forEach(activity => {
      activity.User = this.currentGameNight.value.Members.find(m => m.UserId == activity.UserId);
      switch(activity.EntityType){
        case "GAME":
          activity.Entity = this.currentGameNight.value.Games.find(g => g.GameId == activity.EntityId);
          break;
        case "MEMBER":
          activity.Entity = this.currentGameNight.value.Members.find(m => m.MemberId == activity.EntityId);
          break;
        case "MATCH":
          activity.Entity = this.currentGameNight.value.Matches.find(m => m.MatchId == activity.EntityId);
          break;
        default:
          break;
      }
    })
    return activities;
  }
}