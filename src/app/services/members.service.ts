import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Http, Headers} from '@angular/http';

import {AppStore} from '../models/appstore.model';
import {Member} from '../models/member.model';
import {firebaseConfig} from '../firebaseConfig';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class MembersService {
  
  members: Observable<Array<Member>>;
  
  constructor(private store: Store<AppStore>, private http: Http) {
    this.members = store.select('members');
  }

  loadMembers() {
    this.http.get(`${firebaseConfig.databaseURL}/v1/members.json`)
      .map(res => res.json())
      .map(members => {
        // Map the Id from Firebase to each member's Id
        return Object.keys(members).map((val => {
          var member = new Member(members[val]);
          member.id = val;
          return member;
        }))
      })
      .map(payload => ({ type: 'POPULATE_MEMBERS', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createMember(member: Member) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/members.json`, JSON.stringify(member), HEADER)
      .map(res => {
        // Firebase Id is returned, add it to the member object
        member.id = res.json().name;
        return member;
      })
      .map(payload => ({ type: 'CREATE_MEMBER', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}