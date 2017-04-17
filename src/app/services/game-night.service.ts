import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {firebaseConfig} from '../constants/firebaseConfig';
import {GameNight} from '../models/game-night.model';
import {Game} from '../models/game.model';
import {Auth, IAuth} from '../models/auth.model';
import {AuthService} from './auth.service';
import {Member} from '../models/member.model';
import {Match} from '../models/match.model';
import {Player} from '../models/player.model';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class GameNightService {

  gameNight: Observable<GameNight>;
  myGameNights: Observable<Array<GameNight>>;

  nightLoaded: boolean = false;
  nightsLoaded: boolean = false;  

  constructor(private store: Store<AppStore>, private http: Http, private authService: AuthService) {
    this.gameNight = store.select("gameNight");
    this.myGameNights = store.select("myGameNights");
  }

  loadGameNight(id: string) {
    if (!this.nightLoaded) {
      this.http.get(`${firebaseConfig.databaseURL}/v1/game-nights/${id}.json`)
        .map(res => res.json())
        .map(gameNight => {
          var night = new GameNight(gameNight);
          // Attach the Id from Firebase to the nights's Id        
          night.id = id;

          /* Map the IDs from Firebase */
          night.hosts = Object.keys(night.hosts).map((val => {
            var auth = new Auth(night.hosts[val]);
            auth.uid = val;
            return auth;
          }))
          night.members = Object.keys(night.members).map((val => {
              var member = new Member(night.members[val]);
              member.uid = val;
              return member;
            }))
          night.collection = Object.keys(night.collection).map((val => {
            var game = new Game(night.collection[val]);
            game.id = val;
            return game;
          }))
          night.matches = Object.keys(night.matches).map((val => {
            var match = new Match(night.matches[val]);
            match.id = val;
            match.players = Object.keys(match.players).map(val => {
              var player = new Player(match.players[val]);
              player.id = val;
              return player;
            })
            return match;
          }))

          return night;
        })
        .map(payload => ({ type: 'POPULATE_NIGHT', payload }))
        .subscribe(action => this.store.dispatch(action));
    }
    this.nightLoaded = true;
  }

  loadMyGameNights(id: string) {
    if (!this.nightsLoaded) {
      this.http.get(`${firebaseConfig.databaseURL}/v1/game-nights.json?orderBy="hosts"`)
        .map(res => res.json())
        .map(this.unpackageGameNights)
        .subscribe(payload => {
          var filtered = this.filterMyNights(payload, id);
          this.store.dispatch({ type: 'POPULATE_MY_NIGHTS', payload: filtered.myNights })
      });
    }
    this.nightsLoaded = true;
  }

  createGameNight(night: GameNight) {
    night = this.packageGameNight(night);
    this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights.json`, JSON.stringify(night), HEADER)
      .map(res => {
        // Firebase Id is returned, add it to the member object
        night.id = res.json().name;
        return night;
      })
      .map(payload => ({ type: 'CREATE_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  // Package GameNight object for Firebase
  // Need to convert any typed arrays to objects using the FB key
  packageGameNight(night: GameNight):any {
    var output = {
      name: night.name,
      hosts: {}
    }
    night.hosts.forEach((auth: IAuth) => {
      output.hosts[auth.uid] = auth;
    })
    return output;
  }

  unpackageGameNights(nights: any[]): GameNight[] {
    // Map the Id from Firebase to each night's Id
    return Object.keys(nights).map((val => {
      var night = new GameNight(nights[val]);
      night.id = val;
      // Map the Id from Firebase to each host's Id
      if (nights[val].hosts) night.hosts = Object.keys(nights[val].hosts).map((val2 => {
        var auth = new Auth(nights[val].hosts[val2]);
        auth.uid = val2;
        return auth;
      }))
      // Map the Id from Firebase to each member's Id
      if (nights[val].members) night.members = Object.keys(nights[val].members).map((val2 => {
        var member = new Member(nights[val].members[val2]);
        member.uid = val2;
        return member;
      }))
      return night;
    }))
  }

  filterMyNights(nights: GameNight[], id: string) {
    var myNights = new Array<GameNight>();
    var otherNights = new Array<GameNight>();
    nights.forEach(night => {
      if (night.hosts.findIndex(host => host.uid === id) > -1 ||
          night.members.findIndex(mem => mem.uid === id) > -1) {
            myNights.push(night);
          } else {
            otherNights.push(night);
          }
    })
    return {myNights: myNights, otherNights: otherNights};
  }
}