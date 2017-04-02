import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Game} from '../../../models/game.model';
import {Member} from '../../../models/member.model';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {

  @Input() games: Game[];
  @Input() members: Member[];

  constructor() { }

  ngOnInit() {
  }

}
