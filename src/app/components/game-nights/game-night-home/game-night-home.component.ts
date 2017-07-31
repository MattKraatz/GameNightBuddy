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
  activities: Array<Activity>;

  constructor(private gameNightService: GameNightService) {
    this.gameNightService.currentGameNight.subscribe(night => {
      this.gameNight = night;
      this.hosts = night.Members.filter(m => m.IsHost);
      if (night.Notifications && night.Notifications.length > 0){
        this.activities = night.Notifications;
      }
    })
  }

  ngOnInit() {
    this.gameNightService.getNotifications(this.gameNight.GameNightId);
  }

}
