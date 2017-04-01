import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Store} from '@ngrx/store';

import {AppStore} from '../models/appstore.model';
import {Member} from '../models/member.model';

@Injectable()
export class MembersService {
  
  members: Observable<Array<Member>>;
  
  constructor(private store: Store<AppStore>) {
    this.members = store.select('members'); // Bind an observable of our members to "MembersService"
  }

  loadMembers() {
    let initialMembers:Member[] = [
      new Member(3, 'Dr', 'Strange', 'strange@email.com'),
      new Member(5, 'Dr', 'Normal', 'normal@email.com'),
      new Member(99, 'Dr', 'Cool', 'cool@email.com')
    ];
    this.store.dispatch({type: 'POPULATE_MEMBERS', payload: initialMembers});
  }

  createMember(member: Member) {
    console.log(member)
    this.store.dispatch({type: "CREATE_MEMBER", payload: member});
  }
}