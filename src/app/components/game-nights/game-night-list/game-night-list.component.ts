import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {GameNight} from '../../../models/game-night.model';

@Component({
  selector: 'app-game-night-list',
  templateUrl: './game-night-list.component.html',
  styleUrls: ['./game-night-list.component.css']
})
export class GameNightListComponent implements OnInit {

  @Input() gameNights: GameNight[];

  page: number = 1;
  itemsPerPage: number = 10;

  constructor() {}

  ngOnInit() {
  }

}
