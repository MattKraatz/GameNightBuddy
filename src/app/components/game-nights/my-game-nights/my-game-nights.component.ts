import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {GameNight} from '../../../models/game-night.model';
import {GameNightService} from '../../../services/game-night.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-my-game-nights',
  templateUrl: './my-game-nights.component.html',
  styleUrls: ['./my-game-nights.component.css']
})
export class MyGameNightsComponent implements OnInit {

  gameNights: Observable<Array<GameNight>>;
  isLoading: Observable<boolean>;

  constructor(private gameNightService: GameNightService, private authService: AuthService) {
    this.gameNights = gameNightService.myGameNights;
    this.isLoading = gameNightService.isMyGameNightsLoading.asObservable();
    gameNightService.loadMyGameNights();
  }

  ngOnInit() {
  }

}
