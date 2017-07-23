import {Component, OnInit} from '@angular/core';

import {GameNightService} from '../../../services/game-night.service';
import {GameNight} from '../../../models/game-night.model';
import {Member} from '../../../models/member.model';

@Component({
  selector: 'app-game-night-home',
  templateUrl: './game-night-home.component.html',
  styleUrls: ['./game-night-home.component.css']
})
export class GameNightHomeComponent implements OnInit {

  gameNight: GameNight;
  hosts: Array<Member>;

  constructor(private gameNightService: GameNightService) {
    this.gameNightService.currentGameNight.subscribe(night => {
      this.gameNight = night;
      this.hosts = night.Members.filter(m => m.IsHost);
    })
  }

  ngOnInit() {
  }

}
