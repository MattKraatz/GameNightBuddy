import {Member} from './member.model';
import {Game} from './game.model';
import {Player} from './player.model';

interface IMatch {
  id: string;
  date: Date;
  game: Game;
  players: Player[];
}

export class Match {
  public id: string;
  public date: Date;
  public game: Game;
  public players: Player[];

  constructor(obj?: IMatch){
    this.id = obj && obj.id || "";
    this.date = obj && obj.date || new Date();
    this.game = obj && obj.game || new Game();
    this.players = obj && obj.players || new Array<Player>();
  }
  
}