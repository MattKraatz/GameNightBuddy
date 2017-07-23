import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/pairwise';
import {Router, NavigationEnd} from '@angular/router';

import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
import {Match} from '../../../models/match.model';
import {Player} from '../../../models/player.model';
import {GameNightService} from '../../../services/game-night.service';
import {CollectionService} from '../../../services/collection.service';

@Component({
  selector: 'app-game-recommender',
  templateUrl: './game-recommender.component.html',
  styleUrls: ['./game-recommender.component.css']
})
export class GameRecommenderComponent implements OnInit {

  model: Member[];
  players: Member[];
  recommendations: Game[];

  constructor(private gameNightService: GameNightService, private collectionService: CollectionService,
              private router: Router) {
    this.model = new Array<Member>()
    this.gameNightService.currentGameNight.subscribe(night => {
      this.players = night.Members;
    })
    this.collectionService.gameRecommendations.subscribe(r => {
      this.recommendations = r;
    });
  }

  ngOnInit() {
    // if we're navigating from anything other than a recommender child,
    // clear the recommendations list
    this.router.events
        .filter(e => e instanceof NavigationEnd)
        .pairwise().subscribe((e:[NavigationEnd,NavigationEnd]) => {
          if (!e[0].url.includes("recommender")){
            this.recommendations.length = 0;
          }
        });
  }

  getRecommendations(model: Member[]){
    var search = new Array<Member>();
    model.forEach(m => search.push(m));
    this.collectionService.getGameRecommendation(search);
  }

}
