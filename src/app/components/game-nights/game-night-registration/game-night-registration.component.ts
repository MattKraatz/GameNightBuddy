import {Component, OnInit} from '@angular/core';
import {GameNight} from '../../../models/game-night.model';
import {Member} from '../../../models/member.model';
import {GameNightService} from '../../../services/game-night.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-game-night-registration',
  templateUrl: './game-night-registration.component.html',
  styleUrls: ['./game-night-registration.component.css']
})
export class GameNightRegistrationComponent implements OnInit {

  constructor(private gameNightService: GameNightService, private authService: AuthService) { }

  ngOnInit() {
  }

  model = new GameNight();

  onSubmit() {
    var night = new GameNight(this.model);
    var member = new Member();
    member.UserId = this.authService.currentUserProfile.UserId;
    member.IsHost = true;
    night.Members.push(member);

    this.gameNightService.createGameNight(night);
  }

}
