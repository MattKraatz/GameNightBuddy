import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {GameNight} from '../../../models/game-night.model';
import {Member} from '../../../models/member.model';
import {MembersService} from '../../../services/members.service';

@Component({
  selector: 'app-game-night-members',
  templateUrl: './game-night-members.component.html',
  styleUrls: ['./game-night-members.component.css']
})
export class GameNightMembersComponent implements OnInit {

  members: Member[];
  nightId: string;

  constructor(route: ActivatedRoute, private membersService: MembersService) {
    route.parent.data.subscribe(data => {
      var night: GameNight = data['gameNight'];
      this.members = night.Members;
      this.nightId = night.GameNightId;
    })
  }

  ngOnInit() {
  }

  addMember(model: Member) {
    var member = new Member(model);
    this.membersService.createMember(model, this.nightId);
  }

}
