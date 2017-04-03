import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {AuthService} from './services/auth.service';
import {User} from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Game Night Buddy';
  user: Observable<User>;

  constructor(private authService: AuthService) {
    this.user = authService.user;
  }

  ngOnInit() {
    
  }
}
