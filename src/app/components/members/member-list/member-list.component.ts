import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Member } from '../../../models/member.model';

import { GameNightService } from '../../../services/game-night.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  @Input() members: Member[];

  isHost: boolean = false;
  nightId: string;
  memberToRemove: string;

  // Pagination
  page: number = 1;
  itemsPerPage: number = 10;

  constructor(private gameNightService: GameNightService,
    private modalService: NgbModal) {
    this.isHost = this.gameNightService.isHost;
    this.nightId = this.gameNightService.currentGameNight.value.GameNightId;
  }

  ngOnInit() {
  }

  promoteMember(member: Member) {
    member.IsHost = true;
    this.gameNightService.updateGameNightMember(member, this.nightId);
  }

  removeMember() {
    console.log("removing member ", this.memberToRemove);
  }

  // Delete modal
  closeResult: string;

  confirmRemove(content, member: Member) {
    this.memberToRemove = member.MemberId;
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result == "Delete") {
        this.removeMember();
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
