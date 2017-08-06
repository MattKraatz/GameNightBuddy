import {Component, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {GameNight} from '../../../models/game-night.model';
import {GameNightService} from '../../../services/game-night.service';
import {NavbarService} from '../../../services/navbar.service';

@Component({
  selector: 'app-game-night-navbar',
  templateUrl: './game-night-navbar.component.html',
  styleUrls: ['./game-night-navbar.component.css']
})
export class GameNightNavbarComponent implements OnInit {

  @Input() set gameNight(night: Observable<GameNight>) {
    this._gameNight = night;
    if (this.isReloading) this.isReloading = false;
  }

  _gameNight: Observable<GameNight>;

  isReloading: boolean = false;
  isContentLoading: boolean = false;

  navbarClasses = {
    show: false
  }

  constructor(private gameNightService: GameNightService, private navbarService: NavbarService) {
    navbarService.GameNightNavbarExpanded.subscribe(b => {
      this.navbarClasses.show = b
    });
    navbarService.isGameNightContentLoading.subscribe(b => {
      this.isContentLoading = b;
    })
  }

  ngOnInit() {
  }

  refreshGameNight() {
    this.isReloading = true;
    this.gameNightService.refreshGameNight();
  }

  toggleNavbarExpand() {
    this.navbarService.toggleGameNightNavbar();
  }

}
