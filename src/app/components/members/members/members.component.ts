import {Component, OnInit} from '@angular/core';
import {Member} from '../../../models/member.model';
import {MembersService} from '../../../services/members.service';
import {Observable} from "rxjs/Observable";
import {Store} from '@ngrx/store';
import {AppStore} from '../../../models/appstore.model';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  providers: [MembersService] 
})
export class MembersComponent implements OnInit {

  members: Observable<Array<Member>>;

  constructor(private membersService: MembersService, private store: Store<AppStore>) {
    this.members = membersService.members;
    membersService.loadMembers();
  }

  ngOnInit() {
  }
  
}
