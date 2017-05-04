import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Http, Headers} from '@angular/http';

import {Member} from '../../../models/member.model';
import {User} from '../../../models/user.model';
import {AuthService} from '../../../services/auth.service';
import {firebaseConfig} from '../../../constants/firebaseConfig';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {

  @Output() addMember = new EventEmitter();
  @Input() members: Member[];

  private results: User[];

  constructor(private authService: AuthService, private http: Http) {
  }

  ngOnInit() {
  }

  model = "";

  // let's do this locally for now, should probably integrate this into the store long-term
  doSearch() {
    this.results = null;
    this.authService.searchUsers(this.model)
      .subscribe(u => this.results = u);
  }

}
