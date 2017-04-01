import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Member} from '../../../models/member.model';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  @Input() members: Member[];

  constructor() {
  }

  ngOnInit() {
  }

}
