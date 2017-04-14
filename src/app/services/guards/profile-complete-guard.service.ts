import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from "rxjs/Observable";

import {AuthService} from '../auth.service';
import {Auth} from '../../models/auth.model';

@Injectable()
export class ProfileCompleteGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.userLoaded ?
      Observable.of(this.validateProfile(this.authService.currentUser)) :
      this.authService.user.skip(1).map(auth => this.validateProfile(auth))
        .catch((e) => Observable.of(false));
    }

    validateProfile(user: Auth): boolean {
      var output = false;
      if (user.firstName && user.firstName.length > 0 &&
          user.lastName && user.lastName.length > 0 &&
          user.email && user.email.length > 0) {
            output = true;
          } else {
            this.router.navigate(['profile']);
          }
      return output;
    }
  }