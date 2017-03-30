import { Component, OnInit } from '@angular/core';
import { Member } from '../../../models/member';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // NEW MEMBER FORM //
  model = new Member(1, 'Dr IQ', 'Strange', 'email@email.com');
  submitted = false;
  onSubmit() { this.submitted = true; }
}
