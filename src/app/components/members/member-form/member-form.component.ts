import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Member} from '../../../models/member.model';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {

  @Output() addMember = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  // NEW MEMBER FORM //
  model = new Member();
}
