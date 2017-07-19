import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {MatchService} from '../../../services/match.service';
import {GameNightService} from '../../../services/game-night.service';
import {GameNight} from '../../../models/game-night.model';
import {Member} from '../../../models/member.model';
import {Game} from '../../../models/game.model';
import {Match} from '../../../models/match.model';

@Component({
  selector: 'app-game-night-matches',
  templateUrl: './game-night-matches.component.html',
  styleUrls: ['./game-night-matches.component.css']
})
export class GameNightMatchesContainer implements OnInit {

  members: Observable<Array<Member>>;
  collection: Observable<Array<Game>>;
  matches: Observable<Array<Match>>;
  nightId: string;

  constructor(private gameNightService: GameNightService, private matchService: MatchService) {
    this.gameNightService.currentGameNight.subscribe(night => {
      this.members = Observable.of(night.Members);
      this.collection = Observable.of(night.Games);
      this.matches = Observable.of(night.Matches);
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
