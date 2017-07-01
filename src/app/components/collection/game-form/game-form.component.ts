import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
import {User} from '../../../models/user.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css']
})
export class GameFormComponent implements OnInit {

  @Input() members: Member[];
  @Output() addGame = new EventEmitter();

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    if (this.members && this.members.length) {
      this.model.Owner = this.authService.currentUserProfile;
    }
  }

  // NEW MEMBER FORM //
  model = new Game();

  byUserId(user1: User, user2: User){
    return (user1 && user2) ? user1.UserId === user2.UserId : false;
  }
}
