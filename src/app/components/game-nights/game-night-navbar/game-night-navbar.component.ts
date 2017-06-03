import {Component, OnInit, Input} from '@angular/core';
import {GameNight} from '../../../models/game-night.model';
import {GameNightService} from '../../../services/game-night.service';

@Component({
  selector: 'app-game-night-navbar',
  templateUrl: './game-night-navbar.component.html',
  styleUrls: ['./game-night-navbar.component.css']
})
export class GameNightNavbarComponent implements OnInit {

  @Input() gameNight: GameNight;

  constructor(private gameNightService: GameNightService) { }

  ngOnInit() {
  }

  refreshGameNight() {
    this.gameNightService.refreshGameNight(this.gameNight.GameNightId);
  }

}
