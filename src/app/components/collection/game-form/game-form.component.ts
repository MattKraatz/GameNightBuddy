import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
import {CollectionService} from '../../../services/collection.service';
import {MembersService} from '../../../services/members.service';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css']
})
export class GameFormComponent implements OnInit {

  @Input() members: Member[];

  constructor(private collectionService: CollectionService, private membersService: MembersService) { }

  ngOnInit() {
  }

  // NEW MEMBER FORM //
  model = new Game('1', 'Stone Age', null, 2, 4);
  submitted = false;
  onSubmit() {
    var game = new Game(this.model.id, this.model.name, this.model.owner, this.model.minPlayers, this.model.maxPlayers);
    this.collectionService.createGame(game);
  }

}
