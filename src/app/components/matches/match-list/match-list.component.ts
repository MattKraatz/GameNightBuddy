import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Match} from '../../../models/match.model';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})
export class MatchListComponent implements OnInit {

  @Input() matches: Match[];
  @Input() nightId: string;

  page: number = 1;
  itemsPerPage: number = 6;

  constructor() { }

  ngOnInit() {
  }

}
