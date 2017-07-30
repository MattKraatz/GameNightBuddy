import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {GameNightService} from '../../../services/game-night.service';
import {Activity} from '../../../models/activity.model';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  @Input() activities: Activity[];
  activityLoaded: boolean;

  constructor(private gameNightService: GameNightService) {
    this.activityLoaded = this.gameNightService.activityLoaded;
  }

  ngOnInit() {
  }

}
