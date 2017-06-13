import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Game} from '../../../models/game.model';
import {GameNight} from '../../../models/game-night.model';
import {AuthService} from '../../../services/auth.service';
import {CollectionService} from '../../../services/collection.service';
import {GameNightService} from '../../../services/game-night.service';

@Component({
  selector: 'app-game-night-collection',
  templateUrl: './game-night-collection.component.html',
  styleUrls: ['./game-night-collection.component.css']
})
export class GameNightCollectionComponent implements OnInit {

  collection: Observable<Array<Game>>;
  nightId: string;
  myOtherGames: Observable<Array<Game>>;

  myOtherGamesCount = 0;

  constructor(private authService: AuthService, private collectionService: CollectionService, private gameNightService: GameNightService) {
    this.gameNightService.currentGameNight.subscribe(night => {
      this.collection = Observable.of(night.Games);
      this.nightId = night.GameNightId;

      var otherGames = this.authService.currentUserProfile.Games.filter(g => {
        if (night.Games.length) {
          return night.Games.findIndex(c => c.GameId == g.GameId) < 0;
        } else {
          return false;
        }
      })
      this.myOtherGamesCount = otherGames.length;
      this.myOtherGames = Observable.of(otherGames)
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
