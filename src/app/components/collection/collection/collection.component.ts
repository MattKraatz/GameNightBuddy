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
    this.games = collectionService.collection;
    collectionService.loadCollection(this.authService.currentUser.uid);
  }

  ngOnInit() {
  }

  addGame(model: Game) {
    var game = new Game(model);
    this.authService.userProfile.subscribe(
      user => {
        game.Owner = user;
        this.collectionService.createGame(game);
      }
    )
  }
  
}