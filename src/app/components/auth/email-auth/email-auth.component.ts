import {Component, OnInit} from '@angular/core';

import {Auth} from '../../../models/auth.model';
import {AuthService} from '../../../services/auth.service';
import {ILoginViewModel, LoginViewModel} from '../../../viewmodels/login.viewmodel';

@Component({
  selector: 'app-email-auth',
  templateUrl: './email-auth.component.html',
  styleUrls: ['./email-auth.component.css']
})
export class EmailAuthComponent implements OnInit {

  loginTabClasses = {
    'nav-link': true,
    active: true
  }

  registerTabClasses = {
    'nav-link': true,
    active: false
  }

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  // NEW USER FORM //
  loginModel = new LoginViewModel();
  registerModel = new LoginViewModel();

  onLoginSubmit() {
    console.log(this.loginModel);
    var user = new LoginViewModel(this.loginModel);
    this.authService.loginWithEmailAndPassword(user);
  }
  onRegisterSubmit() {
    var user = new LoginViewModel(this.registerModel);
    if (user.Password == user.ConfirmPassword) this.authService.registerEmailAndPassword(user);
  }

  setTab(tab: string) {
    if (tab == "register") {
      this.loginTabClasses.active = false;
      this.registerTabClasses.active = true;
    } else if (tab == "login") {
      this.registerTabClasses.active = false;
      this.loginTabClasses.active = true;
    }
  }

}
