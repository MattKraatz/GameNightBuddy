import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from "rxjs/Observable";

import {AuthService} from '../auth.service';

@Injectable()
export class ProfileCompleteGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.currentUser.firstName && this.authService.currentUser.firstName.length > 0 &&
        this.authService.currentUser.lastName && this.authService.currentUser.lastName.length > 0 &&
        this.authService.currentUser.email && this.authService.currentUser.email.length > 0) {
      return true;
    } else {
      this.router.navigate(['profile']);
      return false;
    }
  }
}