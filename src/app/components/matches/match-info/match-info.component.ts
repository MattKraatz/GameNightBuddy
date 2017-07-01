import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {Match} from '../../../models/match.model';

@Component({
  selector: 'app-match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.css']
})
export class MatchInfoComponent implements OnInit {

  @Input() match: Match;

  constructor() { }

  ngOnInit() {
  }

}
