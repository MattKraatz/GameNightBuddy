import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
import {CollectionService} from '../../../services/collection.service';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css']
})
export class GameFormComponent implements OnInit {

  @Input() members: Member[];

  constructor(private collectionService: CollectionService) { }

  ngOnInit() {
  }

  // NEW MEMBER FORM //
  model = new Game();
  onSubmit() {
    var game = new Game(this.model);
    this.collectionService.createGame(game);
  }

}
