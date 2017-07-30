import {Component, OnInit} from '@angular/core';
import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';
import {CollectionService} from '../../../services/collection.service';
import {AuthService} from '../../../services/auth.service';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  games: Observable<Array<Game>>;

  constructor(private collectionService: CollectionService, private authService: AuthService) {
    this.games = this.collectionService.collection;
    this.collectionService.loadCollection(this.authService.currentUserProfile.UserId);
  }

  ngOnInit() {
  }

  addGame(model: Game) {
    var game = new Game(model);
    game.Owner = this.authService.currentUserProfile;
    this.collectionService.createGame(game);
  }
  
}