import {Member} from './member.model';
import {Game} from './game.model';
import {Player} from './player.model';

interface IMatch {
  id: string;
  date: string;
  game: Game;
  players: Player[];
  winner: Player;
}

export class Match {
  public id: string;
  public date: string;
  public game: Game;
  public players: Player[];
  public winner: Player;

  constructor(obj?: IMatch){
    this.id = obj && obj.id || "";
    this.date = obj && obj.date || "";
    this.game = obj && obj.game || new Game();
    this.players = obj && obj.players || new Array<Player>();
    this.winner = obj && obj.winner || new Player();
  }
  
}