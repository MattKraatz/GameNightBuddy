import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {Auth} from '../../../models/auth.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(auth => this.model = auth);
  }

  ngOnInit() {
  }

  // UPDATE PROFILE FORM //
  model = new Auth();

  updateProfile() {
    var user = new Auth(this.model);
    this.authService.updateUserInFB(user);
  }
}
