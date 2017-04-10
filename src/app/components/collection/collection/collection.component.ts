import {Component, OnInit} from '@angular/core';
import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
import {CollectionService} from '../../../services/collection.service';
import {MembersService} from '../../../services/members.service';
import {AuthService} from '../../../services/auth.service';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  games: Observable<Array<Game>>;
  members: Observable<Array<Member>>;

  constructor(private collectionService: CollectionService, private membersService: MembersService, private authService: AuthService) {
    this.games = collectionService.collection;
    collectionService.loadCollection();

    this.members = membersService.members;
    membersService.loadMembers();
  }

  ngOnInit() {
  }

  addGame(model: Game) {
    var game = new Game(model);
    this.authService.user.subscribe(
      user => {
        game.owner = user;
        this.collectionService.createGame(game);
      }
    )
  }
  
}