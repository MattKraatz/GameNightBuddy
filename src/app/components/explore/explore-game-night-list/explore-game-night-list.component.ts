import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {GameNight} from '../../../models/game-night.model';

@Component({
  selector: 'app-explore-game-night-list',
  templateUrl: './explore-game-night-list.component.html',
  styleUrls: ['./explore-game-night-list.component.css']
})
export class ExploreGameNightListComponent implements OnInit {

  @Input() gameNights: GameNight[];
  @Output() joinNight = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
