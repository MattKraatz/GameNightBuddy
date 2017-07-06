import {User} from './user.model';

interface IGame {
  GameId: string;
  Name: string;
  Owner: User;
  MinPlayers: number;
  MaxPlayers?: number;
  MyRating: number;
  AvgRating?: number;
  DateCreated: Date;
}

export class Game {

  public GameId: string;
  public Name: string;
  public Owner: User;
  public MinPlayers: number;
  public MaxPlayers?: number;
  public MyRating: number;
  public AvgRating?: number;
  public DateCreated: Date;

  constructor(obj?: IGame) {
    this.GameId = obj && obj.GameId || "";
    this.Name = obj && obj.Name || "";
    this.Owner = obj && obj.Owner || new User();
    this.MinPlayers = obj && obj.MinPlayers || null;
    this.MaxPlayers = obj && obj.MaxPlayers || null;
    this.MyRating = obj && obj.MyRating || 0;
    this.AvgRating = obj && obj.AvgRating || null;    
    this.DateCreated = obj && obj.DateCreated || new Date();
    
  }
}