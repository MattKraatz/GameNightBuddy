import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from "rxjs/Observable";

import {AuthService} from '../auth.service';
import {User} from '../../models/user.model';

@Injectable()
export class ProfileCompleteGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.userLoaded ?
      Observable.of(this.validateProfile(this.authService.currentUserProfile)) :
      this.authService.userProfile.skip(1).map(auth => this.validateProfile(auth))
        .catch((e) => Observable.of(false));
    }

    validateProfile(user: User): boolean {
      var output = false;
      if (user.FirstName && user.FirstName.length > 0 &&
          user.LastName && user.LastName.length > 0 &&
          user.Email && user.Email.length > 0 &&          
          user.DisplayName && user.DisplayName.length > 0) {
            output = true;
          } else {
            this.router.navigate(['profile']);
          }
      return output;
    }
  }