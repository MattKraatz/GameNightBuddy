import {Component, OnInit} from '@angular/core';
import {Member} from '../../../models/member.model';
import {MembersService} from '../../../services/members.service';
import {Observable} from "rxjs/Observable";


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  providers: [MembersService] 
})
export class MembersComponent implements OnInit {

  members: Observable<Array<Member>>;

  constructor(private membersService: MembersService) {
    this.members = membersService.members;
    membersService.loadMembers();
  }

  ngOnInit() {
  }
  
}
