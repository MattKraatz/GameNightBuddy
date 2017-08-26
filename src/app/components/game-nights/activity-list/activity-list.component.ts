import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {GameNightService} from '../../../services/game-night.service';
import {Activity} from '../../../models/activity.model';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  // PAGINATION
  page: number = 1;
  itemsPerPage: number = 10;

  @Input() activities: Activity[];

  constructor(private gameNightService: GameNightService) {
  }

  ngOnInit() {
  }

}
