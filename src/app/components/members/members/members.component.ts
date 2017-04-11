import {Component, OnInit, Input} from '@angular/core';
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

  @Input() members: Member[];

  constructor() {}

  ngOnInit() {
  }
  
}
