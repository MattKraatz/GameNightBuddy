import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Location} from '@angular/common';

import {Match} from '../../../models/match.model';
import {GameNight} from '../../../models/game-night.model';
import {GameNightService} from '../../../services/game-night.service';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {

  match: Match;

  constructor(private route: ActivatedRoute, private location: Location, private gameNightService: GameNightService) {
    // grab the id from route params
    let matchId = route.snapshot.params['id'];
    this.match = this.gameNightService.currentGameNight.value.Matches.filter(m => m.MatchId == matchId)[0];
  }

  ngOnInit() {
  }

  back(){
    this.location.back();
  }

}
