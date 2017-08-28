import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

import { Member } from '../../../models/member.model';
import { GameNightService } from '../../../services/game-night.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  @Input() members: Member[];

  isHost: boolean = false;
  userId: string;
  nightId: string;
  memberToRemove: Member;
  memberToDemote: Member;

  // Pagination
  page: number = 1;
  itemsPerPage: number = 10;

  constructor(private gameNightService: GameNightService, private authService: AuthService,
    private router: Router,
    private modalService: NgbModal) {
    this.isHost = this.gameNightService.isHost;
    this.userId = this.authService.currentUserProfile.UserId;
    this.nightId = this.gameNightService.currentGameNight.value.GameNightId;
  }

  ngOnInit() {
  }

  promoteMember(member: Member) {
    member.IsHost = true;
    this.gameNightService.updateGameNightMember(member, this.nightId);
  }

  removeMember() {
    this.gameNightService.removeGameNightMember(this.memberToRemove.MemberId, this.nightId);
    if (this.memberToRemove.UserId == this.userId) {
      this.router.navigate(['home']);
    }
  }

  demoteMember() {
    console.log("demoting member ", this.memberToDemote.UserId);
    this.memberToDemote.IsHost = false;
    this.isHost = false;
    this.gameNightService.updateGameNightMember(this.memberToDemote, this.nightId);
  }

  // Delete modal
  closeResult: string;

  confirmRemove(content, member: Member) {
    this.memberToRemove = member;
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result == "Delete") {
        this.removeMember();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmDemote(content, member: Member) {
    this.memberToDemote = member;
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result == "Delete") {
        this.demoteMember();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
