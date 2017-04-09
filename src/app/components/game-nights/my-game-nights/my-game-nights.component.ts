import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {GameNight} from '../../../models/game-night.model';
import {GameNightService} from '../../../services/game-night.service';

@Component({
  selector: 'app-my-game-nights',
  templateUrl: './my-game-nights.component.html',
  styleUrls: ['./my-game-nights.component.css']
})
export class MyGameNightsComponent implements OnInit {

  gameNights: Observable<Array<GameNight>>;

  constructor(private gameNightService: GameNightService) {
    this.gameNights = gameNightService.myGameNights;
    gameNightService.loadMyGameNights();
  }

  ngOnInit() {
  }

}
