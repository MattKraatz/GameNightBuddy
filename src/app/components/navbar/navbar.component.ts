import {Component, OnInit, Input} from '@angular/core';
import {Observable} from "rxjs";

import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import {NavbarService} from '../../services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() user: User;
  isLoading: boolean = true;

  navbarClasses = {
    show: false
  }

  constructor(private authService: AuthService, private navbarService: NavbarService) {
    authService.isUserLoading.subscribe(b => {
      this.isLoading = b
    });
    navbarService.MainNavbarExpanded.subscribe(b => {
      this.navbarClasses.show = b
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

  toggleNavbarExpand() {
    this.navbarService.toggleMainNavbar(); 
  }

}
