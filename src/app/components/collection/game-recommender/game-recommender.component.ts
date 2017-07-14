import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
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
  selectedPlayers: Member[];

  constructor(private gameNightService: GameNightService, private collectionService: CollectionService) {
    this.gameNightService.currentGameNight.subscribe(night => {
      this.players = night.Members;
    })
  }

  ngOnInit() {
  }

  getRecommendations(model: Member[]){
    var search = new Array<Member>();
    model.forEach(m => search.push(m));
    this.collectionService.getGameRecommendation(search);
  }

}
