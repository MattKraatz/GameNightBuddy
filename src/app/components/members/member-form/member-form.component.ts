import { Component, OnInit } from '@angular/core';
import {Member} from '../../../models/member.model';
import {MembersService} from '../../../services/members.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {

  constructor(private membersService: MembersService) { }

  ngOnInit() {
  }

  // NEW MEMBER FORM //
  model = new Member(2, 'Dr IQ', 'Strange', 'email@email.com');
  submitted = false;
  onSubmit() {
    var member = new Member(this.model.id, this.model.firstName, this.model.lastName, this.model.email);
    this.membersService.createMember(member);
  }

}
