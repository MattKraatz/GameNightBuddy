import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

import {Match} from '../../../models/match.model';
import {GameNight} from '../../../models/game-night.model';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {

  match: Match;

  constructor(private route: ActivatedRoute) {
    // grab the id from route params
    let id = route.snapshot.params['id'];
    // query the parent's data struct for that specific match
    route.parent.data.subscribe(data => {
      var night: GameNight = data['gameNight'];
      this.match = night.matches.find(match => match.id == id);
    })
  }

  ngOnInit() {
  }

}
