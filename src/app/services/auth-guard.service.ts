import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    console.log('AuthGuard#canActivate called');
    // If logged in, navigate home
    if (this.authService.user && this.authService.user) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}