import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Game} from '../../../models/game.model';
import {GameNight} from '../../../models/game-night.model';
import {AuthService} from '../../../services/auth.service';
import {CollectionService} from '../../../services/collection.service';

@Component({
  selector: 'app-game-night-collection',
  templateUrl: './game-night-collection.component.html',
  styleUrls: ['./game-night-collection.component.css']
})
export class GameNightCollectionComponent implements OnInit {

  collection: Game[];
  nightId: string;
  myOtherGames: Game[];

  constructor(route: ActivatedRoute, private authService: AuthService, private collectionService: CollectionService) {
    route.parent.data.subscribe(data => {
      var night: GameNight = data['gameNight'];
      this.collection = night.Games;
      this.nightId = night.GameNightId;

      this.myOtherGames = this.authService.currentUserProfile.Games.filter(g => {
        return this.collection.findIndex(c => c.GameId == g.GameId) < 0;
      })
    })

    }

  ngOnInit() {
  }

  addGame(model: Game) {
    var game = new Game(model);
    game.Owner = this.authService.getCurrentUserProfile();
    this.collectionService.createGameInGameNightAndMyCollection(game, this.nightId);
  }

  attachGame(model: Game) {
    var game = new Game(model);
    this.collectionService.addGameToGameNight(game, this.nightId);
  }

}
