import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Member} from '../../../models/member.model';

import {GameNightService} from '../../../services/game-night.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  @Input() members: Member[];

  isHost: boolean = false;
  nightId: string;

  page: number = 1;
  itemsPerPage: number = 6;

  constructor(private gameNightService: GameNightService) {
    this.isHost = this.gameNightService.isHost;
    this.nightId = this.gameNightService.currentGameNight.value.GameNightId;
  }

  ngOnInit() {
  }

  promoteMember(member: Member){
    member.IsHost = true;
    this.gameNightService.updateGameNightMember(member, this.nightId);
  }

}
