import { Component, OnInit } from '@angular/core';
import {Member} from '../../../models/member.model';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // NEW MEMBER FORM //
  model = new Member(1, 'Dr IQ', 'Strange', 'email@email.com');
  submitted = false;
  onSubmit() { this.submitted = true; }

}
