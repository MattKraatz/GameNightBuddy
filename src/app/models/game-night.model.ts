import {Member} from './member.model';
import {Auth} from './auth.model';
import {Game} from './game.model';
import {Match} from './match.model';

interface IGameNight {
  GameNightId: string;
  Name: string;
  Members: Member[];
  Games: Game[];
  Matches: Match[];
  DateCreated: Date;
}

export class GameNight {

  public GameNightId: string;
  public Name: string;
  public Members: Member[];
  public Games: Game[];
  public Matches: Match[];

  public DateCreated: Date;

  constructor(obj?: IGameNight) {
    this.GameNightId = obj && obj.GameNightId || "";
    this.Name = obj && obj.Name || "";
    this.Members = obj && obj.Members || new Array<Member>();
    this.Games = obj && obj.Games || new Array<Game>();
    this.Matches = obj && obj.Matches || new Array<Match>();
    this.DateCreated = obj && obj.DateCreated || new Date();
  }
  
}