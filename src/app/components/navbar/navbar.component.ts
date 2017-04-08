import {Component, OnInit, Input} from '@angular/core';

import {Auth} from '../../models/auth.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() user: Auth;

  constructor(private authService: AuthService) {}

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

}
