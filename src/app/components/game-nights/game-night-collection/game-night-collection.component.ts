import {Component, OnInit} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';

import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
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
  myOtherGames: BehaviorSubject<Array<Game>>;
  members: Observable<Array<Member>>;

  myOtherGamesCount = 0;

  constructor(private authService: AuthService, private collectionService: CollectionService, private gameNightService: GameNightService) {
    this.gameNightService.currentGameNight.subscribe(night => {
      this.collection = Observable.of(night.Games);
      this.nightId = night.GameNightId;

      var otherGames = this.authService.currentUserProfile.Games.filter(g => {
        if (night.Games.length) {
          return night.Games.findIndex(c => c.GameId == g.GameId) < 0;
        } else {
          return true;
        }
      })
      this.myOtherGamesCount = otherGames.length;
      this.myOtherGames = new BehaviorSubject(otherGames);
      this.members = Observable.of(night.Members);
    })
  }

  ngOnInit() {
  }

  addGame(model: Game) {
    var game = new Game(model);
    this.collectionService.createGameInGameNightAndMyCollection(game, this.nightId);
  }

  attachGame(model: Game) {
    var game = new Game(model);

    // update the game-dropdown component's list
    var newOtherGamesList = this.myOtherGames.value.filter(g => g.GameId != game.GameId);
    this.myOtherGames.next(newOtherGamesList);

    this.collectionService.addGameToGameNight(game, this.nightId);
  }

}
