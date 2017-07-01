import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Location} from '@angular/common';
import {Observable} from 'rxjs';

import {Match} from '../../../models/match.model';
import {Member} from '../../../models/member.model';
import {Game} from '../../../models/game.model';
import {GameNight} from '../../../models/game-night.model';
import {GameNightService} from '../../../services/game-night.service';
import {MatchService} from '../../../services/match.service';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {

  match: Match;
  matchModel: Match;
  isEditing: boolean = false;

  members: Member[];
  collection: Game[];
  nightId: string;
  matchId: string;

  constructor(private route: ActivatedRoute, private location: Location,
      private gameNightService: GameNightService, private matchService: MatchService) {
    // grab the id from route params
    this.matchId = route.snapshot.params['id'];

    this.gameNightService.currentGameNight.subscribe(night => {
      var match = night.Matches.filter(m => m.MatchId == this.matchId)[0];
      if (match) {
        this.match = match;
        // deep copy (for form reset)
        this.matchModel = JSON.parse(JSON.stringify(match));
        this.members = night.Members;
        this.collection = night.Games;
        this.nightId = night.GameNightId;
      }
    })
  }

  ngOnInit() {
  }

  back(){
    this.location.back();
  }

  toggleEdit(){
    var bool = this.isEditing;
    this.isEditing = bool === true ? false : true;
  }

  updateMatch(model: Match){
    var match = new Match(model);
    this.match = match;
    this.matchModel = JSON.parse(JSON.stringify(match));

    this.matchService.updateMatch(match, this.nightId);
    this.isEditing = false;
  }

  cancelEdit() {
    this.matchModel = JSON.parse(JSON.stringify(this.match));
    this.isEditing = false;
  }

}
