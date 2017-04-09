import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute} from '@angular/router';

import {GameNight} from '../../../models/game-night.model';
import {GameNightService} from '../../../services/game-night.service';

@Component({
  selector: 'app-game-night',
  templateUrl: './game-night.component.html',
  styleUrls: ['./game-night.component.css']
})
export class GameNightComponent implements OnInit {

  gameNight: GameNight;

  constructor(route: ActivatedRoute) {
    route.data.subscribe(data => {
      this.gameNight = data['gameNight']
    })
  }

  ngOnInit() {
  }

}
