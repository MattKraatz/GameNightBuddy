import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {MatchService} from '../../../services/match.service';
import {GameNight} from '../../../models/game-night.model';
import {Member} from '../../../models/member.model';
import {Game} from '../../../models/game.model';
import {Match} from '../../../models/match.model';

@Component({
  selector: 'app-game-night-matches',
  templateUrl: './game-night-matches.component.html',
  styleUrls: ['./game-night-matches.component.css']
})
export class GameNightMatchesComponent implements OnInit {

  members: Member[];
  collection: Game[];
  matches: Match[];
  nightId: string;

  constructor(route: ActivatedRoute, private matchService: MatchService) {
    route.parent.data.subscribe(data => {
      var night: GameNight = data['gameNight'];
      this.members = night.Members;
      this.collection = night.Games;
      this.matches = night.Matches;
      this.nightId = night.GameNightId;
    })
  }

  ngOnInit() {
  }

  addMatch(model: Match) {
    var match = new Match(model);
    this.matchService.createMatch(match, this.nightId);
  }

}
