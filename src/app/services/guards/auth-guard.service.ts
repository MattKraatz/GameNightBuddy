import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from "rxjs/Observable";

import {AuthService} from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // If not logged in, navigate to login page
    return this.authService.af.authState
      .map(state => {
        return state;
      })
      .take(1)
      .map(state => !!state)
      .do(authenticated => {
        if (!authenticated) this.router.navigate([ 'login' ]);
      })
  }
}