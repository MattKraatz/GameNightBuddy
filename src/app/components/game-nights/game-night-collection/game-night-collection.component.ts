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

  constructor(route: ActivatedRoute, private authService: AuthService, private collectionService: CollectionService) {
    route.parent.data.subscribe(data => {
      var night: GameNight = data['gameNight'];
      this.collection = night.collection;
      this.nightId = night.id;
    })
  }

  ngOnInit() {
  }

  addGame(model: Game) {
    var game = new Game(model);
    this.authService.user.subscribe(
      user => {
        game.owner = user;
        this.collectionService.createGameInGameNightCollection(game, this.nightId);
      }
    )
  }

}
