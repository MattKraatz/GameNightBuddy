import {Component, OnInit, Input} from '@angular/core';
import {Member} from '../../../models/member.model';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  @Input() members: Member[];

  constructor() {}

  ngOnInit() {
  }
  
}
