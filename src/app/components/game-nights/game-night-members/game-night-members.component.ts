import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {GameNight} from '../../../models/game-night.model';
import {Auth} from '../../../models/auth.model';


@Component({
  selector: 'app-game-night-members',
  templateUrl: './game-night-members.component.html',
  styleUrls: ['./game-night-members.component.css']
})
export class GameNightMembersComponent implements OnInit {

  members: Auth[];
  nightId: string;

  constructor(route: ActivatedRoute) {
    route.parent.data.subscribe(data => {
      var night: GameNight = data['gameNight'];
      this.members = night.members;
      this.nightId = night.id;
    })
  }

  ngOnInit() {
  }

}
