import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from "rxjs/Observable";

import {AuthService} from '../auth.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
  // If not logged in, navigate to login page
  // Method below from this thread: https://github.com/angular/angularfire2/issues/282
  return this.authService.af.auth.map(authState => {
      if (authState) this.router.navigate(['/home']);
      return !authState;
    }).take(1);
  }
}