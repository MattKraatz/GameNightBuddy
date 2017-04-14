import {Component, OnInit} from '@angular/core';
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

  private results: Auth[];

  constructor(private authService: AuthService, private http: Http) { }

  ngOnInit() {
  }

  model = "";

  // let's do this locally for now, should probably integrate this into the store long-term
  doSearch() {
    this.http.get(`${firebaseConfig.databaseURL}/v1/users.json?orderBy="email"&startAt="${this.model}"`,HEADER)
      .map(res => res.json())
      .map(auths => {
        this.results = Object.keys(auths).map((val => {
            console.log(val);
            var auth = new Auth(auths[val]);
            return auth;
        }))
      })
      .subscribe()
  }
}
