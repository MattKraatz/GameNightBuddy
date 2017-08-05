import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {GameNightService} from '../../../services/game-night.service';
import {GameNight} from '../../../models/game-night.model';
import {Member} from '../../../models/member.model';
import {Activity} from '../../../models/activity.model';

@Component({
  selector: 'app-game-night-home',
  templateUrl: './game-night-home.component.html',
  styleUrls: ['./game-night-home.component.css']
})
export class GameNightHomeComponent implements OnInit {

  gameNight: GameNight;
  hosts: Array<Member>;
  activities: Array<Activity> = new Array<Activity>();
  activityLoaded: Observable<boolean>;

  constructor(private gameNightService: GameNightService) {
    this.activityLoaded = this.gameNightService.activityLoaded.asObservable();
    this.gameNightService.gameNight.subscribe(night => {
      this.gameNight = night;
      this.hosts = night.Members.filter(m => m.IsHost);
      if (night.Notifications && night.Notifications.length > 0){
        this.activities = night.Notifications;
      }
      // figure this out at some point, this is getting called multiple times in some scenarios
      if (!this.gameNightService.activityLoaded.value && night.GameNightId && this.activities.length == 0){
        this.gameNightService.getNotifications(night.GameNightId);
      }
    });
  }

  ngOnInit() {
  }

}
