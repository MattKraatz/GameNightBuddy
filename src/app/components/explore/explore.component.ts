import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {GameNight} from '../../models/game-night.model';
import {GameNightService} from '../../services/game-night.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  gameNights: Observable<Array<GameNight>>;

  constructor(private gameNightService: GameNightService, private authService: AuthService) {
    this.gameNights = gameNightService.otherGameNights;
    gameNightService.loadOtherGameNights(this.authService.currentUserProfile.UserId);
  }

  ngOnInit() {
  }

}
