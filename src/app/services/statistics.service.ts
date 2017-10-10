import { Injectable } from '@angular/core';

import {Match} from '../models/match.model';
import {Game} from '../models/game.model';

@Injectable()
export class StatisticsService {

  constructor() { }

  public sortGamesByMatchesPlayed(matches: Array<Match>, limit: number){
    let matchCount = new Array<{ game: Game, count: number }>();
    matches.forEach(m => {
      let match = matchCount.find(mat => m.Game.GameId === mat.game.GameId);
      if (match === undefined) {
        matchCount.push({ game: m.Game, count: 1 });
      } else {
        match.count += 1;
      }
    });
    matchCount = matchCount.sort((a, b) => {
      return b.count - a.count;
    });

    return matchCount.slice(0,5).reverse();
  }

}
