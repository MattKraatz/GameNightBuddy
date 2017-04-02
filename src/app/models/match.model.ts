import {Member} from './member.model';
import {Game} from './game.model';
import {Player} from './player.model';

export class Match {
  constructor(
    public id: string,
    public date: string,
    public game: Game,
    public players: Player[],
    public winner: Player
  ) {  }
}