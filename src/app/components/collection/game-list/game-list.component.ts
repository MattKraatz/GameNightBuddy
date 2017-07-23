import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IStarRatingOnClickEvent, IStarRatingOnRatingChangeEven, IStarRatingIOnHoverRatingChangeEvent } from "angular-star-rating/src/star-rating-struct";

import { Game } from '../../../models/game.model';
import { GameRating } from '../../../models/game-rating.model';
import { CollectionService } from '../../../services/collection.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  @Input() games: Game[];

  // PAGINATION
  page: number = 1;
  itemsPerPage: number = 10;

  constructor(private collectionService: CollectionService, private authService: AuthService) { }

  ngOnInit() {
  }

  // STAR RATING
  onClickResult: IStarRatingOnClickEvent;
  onHoverRatingChangeResult: IStarRatingIOnHoverRatingChangeEvent;
  onRatingChangeResult: IStarRatingOnRatingChangeEven;

  onClick = ($event: IStarRatingOnClickEvent, gameId: string) => {
    var rating = new GameRating();
    rating.GameId = gameId;
    rating.Rating = $event.rating;
    rating.UserId = this.authService.currentUserProfile.UserId;

    this.collectionService.updateGameRating(rating);
    this.onClickResult = $event;

    // update rating state locally
    this.games = this.games.map(g => {
      if (g.GameId === gameId){
        g.MyRating = $event.rating;
        return g;
      } else {
        return g;
      }
    })
  };

  onRatingChange = ($event: IStarRatingOnRatingChangeEven) => {
    this.onRatingChangeResult = $event;
  };

  onHoverRatingChange = ($event: IStarRatingIOnHoverRatingChangeEvent) => {
    this.onHoverRatingChangeResult = $event;
  };

}
