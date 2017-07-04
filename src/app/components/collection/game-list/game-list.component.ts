import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IStarRatingOnClickEvent, IStarRatingOnRatingChangeEven, IStarRatingIOnHoverRatingChangeEvent} from "angular-star-rating/src/star-rating-struct";
import {Game} from '../../../models/game.model';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  @Input() games: Game[];

  // PAGINATION
  page: number = 1;
  itemsPerPage: number = 6;

  constructor() { }

  ngOnInit() {
  }

  // STAR RATING
  onClickResult:IStarRatingOnClickEvent;
  onHoverRatingChangeResult:IStarRatingIOnHoverRatingChangeEvent;
  onRatingChangeResult:IStarRatingOnRatingChangeEven;
 
  onClick = ($event:IStarRatingOnClickEvent) => {
      console.log('onClick $event: ', $event);
      this.onClickResult = $event;
  };

  onRatingChange = ($event:IStarRatingOnRatingChangeEven) => {
      this.onRatingChangeResult = $event;
  };

  onHoverRatingChange = ($event:IStarRatingIOnHoverRatingChangeEvent) => {
      this.onHoverRatingChangeResult = $event;
  };

}
