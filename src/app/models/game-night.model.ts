import {Member} from './member.model';
import {Auth} from './auth.model';
import {Game} from './game.model';
import {Match} from './match.model';
import {Activity} from './activity.model';

interface IGameNight {
  GameNightId: string;
  Name: string;
  Members: Member[];
  Games: Game[];
  Matches: Match[];
  Notifications: Activity[];
  DateCreated: Date;
}

export class GameNight {

  public GameNightId: string;
  public Name: string;
  public Members: Member[];
  public Games: Game[];
  public Matches: Match[];
  public Notifications: Activity[];

  public DateCreated: Date;

  constructor(obj?: IGameNight) {
    this.GameNightId = obj && obj.GameNightId || "";
    this.Name = obj && obj.Name || "";
    this.Members = obj && obj.Members || new Array<Member>();
    this.Games = obj && obj.Games || new Array<Game>();
    this.Matches = obj && obj.Matches || new Array<Match>();
    this.Notifications = obj && obj.Notifications || new Array<Activity>();
    this.DateCreated = obj && obj.DateCreated || new Date();
  }
  
}