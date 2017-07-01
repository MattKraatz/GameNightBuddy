import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Game} from '../../../models/game.model';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  @Input() games: Game[];

  page: number = 1;
  itemsPerPage: number = 6;

  constructor() { }

  ngOnInit() {
  }

}
