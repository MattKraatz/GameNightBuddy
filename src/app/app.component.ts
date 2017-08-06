import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {AuthService} from './services/auth.service';
import {NavbarService} from './services/navbar.service';
import {User} from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Game Night Buddy';
  user: Observable<User>;

  constructor(private authService: AuthService, private navbarService: NavbarService) {
    this.user = authService.userProfile;
  }

  ngOnInit() {
  }
}
