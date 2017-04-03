import {Component, OnInit, Input} from '@angular/core';

import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() user: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.loginWithFacebook();
  }

  logout() {
    this.authService.logout();
  }

}
