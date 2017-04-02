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
    this.members = store.select('members'); // Bind an observable of our members to "MembersService"
  }

  loadMembers() {
    this.http.get(`${firebaseConfig.databaseURL}/v1/members.json`)
      .map(res => res.json())
      .map(members => {
        // Sanitize Firebase return
        return Object.keys(members).map((val => new Member(val, members[val].firstName, members[val].lastName, members[val].email)))
      })
      .map(payload => ({ type: 'POPULATE_MEMBERS', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  createMember(member: Member) {
    this.http.post(`${firebaseConfig.databaseURL}/v1/members.json`, JSON.stringify(member), HEADER)
      .map(res => {
        // UUID is returned, add it to the member object
        member.id = res.json().name;
        return member;
      })
      .map(payload => ({ type: 'CREATE_MEMBER', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}