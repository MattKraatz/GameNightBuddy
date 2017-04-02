import {Component, OnInit} from '@angular/core';
import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
import {Match} from '../../../models/match.model';
import {CollectionService} from '../../../services/collection.service';
import {MembersService} from '../../../services/members.service';
import {MatchService} from '../../../services/match.service';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  matches: Observable<Array<Match>>;
  games: Observable<Array<Game>>;
  members: Observable<Array<Member>>;

  constructor(private collectionService: CollectionService, private membersService: MembersService, private matchService: MatchService) {
    this.games = collectionService.collection;
    collectionService.loadCollection();

    this.members = membersService.members;
    membersService.loadMembers();

    this.matches = matchService.matches;
    matchService.loadMatches();
  }

  ngOnInit() {
  }

}
