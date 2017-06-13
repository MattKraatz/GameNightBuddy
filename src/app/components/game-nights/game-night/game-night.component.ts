import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {GameNight} from '../../../models/game-night.model';
import {GameNightService} from '../../../services/game-night.service';

@Component({
  selector: 'app-game-night',
  templateUrl: './game-night.component.html',
  styleUrls: ['./game-night.component.css']
})
export class GameNightComponent implements OnInit {

  gameNight: Observable<GameNight>;

  constructor(private gameNightService: GameNightService) {
    this.gameNight = this.gameNightService.gameNight;
  }

  ngOnInit() {
  }

}
