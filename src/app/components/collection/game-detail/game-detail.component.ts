import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Location} from '@angular/common';
import {Observable} from 'rxjs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {Match} from '../../../models/match.model';
import {Member} from '../../../models/member.model';
import {Game} from '../../../models/game.model';
import {GameNight} from '../../../models/game-night.model';
import {GameNightService} from '../../../services/game-night.service';
import {CollectionService} from '../../../services/collection.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  game: Game;
  gameModel: Match;
  isEditing: boolean = false;
  isOwner: boolean = false;

  members: Member[];
  gameId: string;
  nightId: string;

  constructor(private route: ActivatedRoute, private location: Location,
      private modalService: NgbModal,
      private gameNightService: GameNightService, private collectionService: CollectionService,
      private authService: AuthService) {
    // grab the id from route params
    this.gameId = route.snapshot.params['gameId'];
    this.nightId = route.parent.snapshot.params['id'];

    if (this.nightId) {
      this.gameNightService.currentGameNight.subscribe(night => {
        var game = night.Games.filter(g => g.GameId == this.gameId)[0];
        if (game) {
          this.game = game;
          // deep copy (for form reset)
          this.gameModel = JSON.parse(JSON.stringify(game));
          this.members = night.Members;
          this.isOwner = game.Owner.UserId === this.authService.currentUserProfile.UserId;
        }
      })
    } else if (this.gameId){
      this.collectionService.collection.subscribe(games => {
        var game = games.filter(g => g.GameId === this.gameId)[0];
        if (game) {
          this.game = game;
          // deep copy (for form reset)
          this.gameModel = JSON.parse(JSON.stringify(game));
          this.isOwner = game.Owner.UserId === this.authService.currentUserProfile.UserId;          
        }
      })
    }
  }

  ngOnInit() {
  }

  updateGame(model: Game){
    var game = new Game(model);
    this.game = game;
    this.gameModel = JSON.parse(JSON.stringify(game));

    this.collectionService.updateGame(game);
    this.isEditing = false;
  }

  deleteGame(){
    console.log("deleting ", this.gameId);
  }

  // Back button
  back(){
    this.location.back();
  }

  // Edit button
  toggleEdit(){
    var bool = this.isEditing;
    this.isEditing = bool === true ? false : true;
  }

  // Cancel button
  cancelEdit() {
    this.gameModel = JSON.parse(JSON.stringify(this.game));
    this.isEditing = false;
  }

  // Delete modal
  closeResult: string;

  confirmDelete(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result == "Delete"){
        this.deleteGame();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }


  }

}
