import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnClickEvent, OnRatingChangeEvent, OnHoverRatingChangeEvent } from "../../../models/star-rating.interface";
import {ActivatedRoute} from '@angular/router';

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
  nightId: string;

  // PAGINATION
  page: number = 1;
  itemsPerPage: number = 10;

  constructor(private collectionService: CollectionService, private authService: AuthService,
    private route: ActivatedRoute) {
    }

  ngOnInit() {
  }

  // STAR RATING
  onClickResult: OnClickEvent;
  onHoverRatingChangeResult: OnHoverRatingChangeEvent;
  onRatingChangeResult: OnRatingChangeEvent;

  onClick = ($event: OnClickEvent, gameId: string) => {
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

  onRatingChange = ($event: OnRatingChangeEvent) => {
    this.onRatingChangeResult = $event;
  };

  onHoverRatingChange = ($event: OnHoverRatingChangeEvent) => {
    this.onHoverRatingChangeResult = $event;
  };

}
