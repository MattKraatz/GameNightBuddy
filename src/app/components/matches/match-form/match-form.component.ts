import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
import {Match} from '../../../models/match.model';
import {MatchService} from '../../../services/match.service';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {

  @Input() games: Game[];
  @Input() members: Member[];
  @Input() match: Match;
  @Output() addMatch = new EventEmitter();

  model: Match;

  constructor(private matchService: MatchService) {
    this.model = new Match();
  }

  ngOnInit() {
    if (this.match) {
      this.model = this.match;
    }
  }

  byGameId(game1: Game, game2: Game){
    return (game1 && game2) ? game1.GameId === game2.GameId : false;
  }

  byMemberId(member1: Member, member2: Member){
    return (member1 && member2) ? member1.MemberId === member2.MemberId : false;
  }

}
