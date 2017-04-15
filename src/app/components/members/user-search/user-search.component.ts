import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Http, Headers} from '@angular/http';

import {Auth} from '../../../models/auth.model';
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
  @Input() members: Auth[];

  private results: Auth[];

  constructor(private authService: AuthService, private http: Http) { }

  ngOnInit() {
  }

  model = "";

  // let's do this locally for now, should probably integrate this into the store long-term
  doSearch() {
    this.results = null;
    this.http.get(`${firebaseConfig.databaseURL}/v1/users.json?orderBy="email"&equalTo="${this.model}"`,HEADER)
      .map(res => res.json())
      .map(auths => {
        // map the keys from Firebase to new Auth objects
        this.results = Object.keys(auths)
          .map((val => {
            var auth = new Auth(auths[val]);
            return auth;
          }))
          // filter out any results that are already included in this game night
          .filter(val => this.members.findIndex(mem => mem.email == val.email) < 0)
      })
      .subscribe()
  }

}
