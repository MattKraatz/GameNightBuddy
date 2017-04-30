import {Member} from './member.model';
import {Game} from './game.model';
import {Player} from './player.model';

interface IMatch {
  MatchId: string;
  Date: Date;
  Game: Game;
  Players: Player[];
}

export class Match {
  public MatchId: string;
  public Date: Date;
  public Game: Game;
  public Players: Player[];

  constructor(obj?: IMatch){
    this.MatchId = obj && obj.MatchId || "";
    this.Date = obj && obj.Date || new Date();
    this.Game = obj && obj.Game || new Game();
    this.Players = obj && obj.Players || new Array<Player>();
  }
  
}