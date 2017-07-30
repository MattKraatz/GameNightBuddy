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
  activities: Observable<Array<Activity>>;
  activitiesLoaded: boolean = false;

  constructor(private gameNightService: GameNightService) {
    this.gameNightService.currentGameNight.subscribe(night => {
      this.gameNight = night;
      this.hosts = night.Members.filter(m => m.IsHost);
      if (night.Notifications && night.Notifications.length > 0){
        this.activitiesLoaded = true;
        this.activities = Observable.of(night.Notifications);
      }
    })
  }

  ngOnInit() {
    if (!this.activitiesLoaded){
      this.gameNightService.getNotifications(this.gameNight.GameNightId);
    }
  }

}
