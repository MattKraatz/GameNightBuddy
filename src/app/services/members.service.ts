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
}