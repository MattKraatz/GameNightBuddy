import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
import {CollectionService} from '../../../services/collection.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css']
})
export class GameFormComponent implements OnInit {

  @Input() members: Member[];
  @Output() addGame = new EventEmitter();

  constructor(private collectionService: CollectionService, private authService: AuthService) { }

  ngOnInit() {
  }

  // NEW MEMBER FORM //
  model = new Game();
}
