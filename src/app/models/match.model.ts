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
    this.Date = (obj && obj.Date) ? new Date(obj.Date) : new Date();
    this.Game = obj && obj.Game || new Game();
    if (obj && obj.Players) {
      this.Players = new Array<Player>();
      obj.Players.forEach((p) => {
        this.Players.push(new Player(p));
      })
    } else {
      this.Players = new Array<Player>();
    }
  }
  
}