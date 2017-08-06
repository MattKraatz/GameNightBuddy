import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';

import {GameNight} from '../../models/game-night.model';
import {GameNightService} from '../game-night.service';

@Injectable()
export class GameNightResolver implements Resolve<GameNight> {

  constructor(private gameNightService: GameNightService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GameNight> {
    let id = route.params['id'];
    // let loaded: boolean = this.gameNightService.nightLoaded;
    this.gameNightService.loadGameNight(id);
    // Complete the Observable by calling .first
    return this.gameNightService.gameNight.skip(1).first();
  }
}
