import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {User} from '../../../models/user.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  isProfileUpdating: boolean = false;
  hideProfileUpdateSuccess: boolean = true;

  constructor(private authService: AuthService) {
    this.authService.userProfile.subscribe(user => {
      this.model = user
      if (this.isProfileUpdating) {
        this.isProfileUpdating = false;
        this.hideProfileUpdateSuccess = false;
        setTimeout(() => {this.hideProfileUpdateSuccess = true}, 5000)
      }
    });
  }

  ngOnInit() {
  }

  // UPDATE PROFILE FORM //
  model = new User();

  updateProfile() {
    var user = new User(this.model);
    this.isProfileUpdating = true;
    this.hideProfileUpdateSuccess = true;
    this.authService.updateUserInDB(user);
  }
}
