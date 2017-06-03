import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {GameNight} from '../../../models/game-night.model';
import {Member} from '../../../models/member.model';
import {GameNightService} from '../../../services/game-night.service';

@Component({
  selector: 'app-game-night-members',
  templateUrl: './game-night-members.component.html',
  styleUrls: ['./game-night-members.component.css']
})
export class GameNightMembersComponent implements OnInit {

  members: Observable<Array<Member>>;
  nightId: string;

  constructor(private gameNightService: GameNightService) {
    this.gameNightService.currentGameNight.subscribe(night => {
      this.members = Observable.of(night.Members);
      this.nightId = night.GameNightId;
    })
  }

  ngOnInit() {
  }

  addMember(model: Member) {
    var member = new Member(model);
    this.gameNightService.addGameNightMember(model, this.nightId);
  }

}
