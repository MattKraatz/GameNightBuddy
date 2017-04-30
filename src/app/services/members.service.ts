import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Member} from '../models/member.model';
import {firebaseConfig} from '../constants/firebaseConfig';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class MembersService {
  
  members: Observable<Array<Member>>;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.members = store.select('members');
  }

  loadMembers(id: string) {
    this.http.get(`${firebaseConfig.databaseURL}/v1/game-nights/${id}/members.json`)
      .map(res => res.json())
      .map(members => {
        console.log(members)
        return members;
      })
      .map(payload => ({ type: 'POPULATE_MEMBERS', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createMember(member: Member, id: string) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/game-nights/${id}/members.json`, JSON.stringify(member), HEADER)
      .map(res => {
        console.log(member);
        return member;
      })
      .map(payload => ({ type: 'CREATE_MEMBER_IN_GAME_NIGHT', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}