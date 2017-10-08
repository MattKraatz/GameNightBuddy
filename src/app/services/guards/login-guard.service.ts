import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from "rxjs/Observable";

import {AuthService} from '../auth.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
  // If logged in, navigate to home page
  return this.authService.af.authState.map(authState => {
      if (authState) this.router.navigate(['/home']);
      return !authState;
    }).take(1);
  }
}