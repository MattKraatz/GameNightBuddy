import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Game} from '../../../models/game.model';

@Component({
  selector: 'app-game-dropdown',
  templateUrl: './game-dropdown.component.html',
  styleUrls: ['./game-dropdown.component.css']
})
export class GameDropdownComponent implements OnInit {

  @Input() games: Game[];
  @Output() attachGame = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  model = new Game();

}
