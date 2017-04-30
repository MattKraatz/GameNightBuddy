import {User} from './user.model';

interface IGame {
  GameId: string;
  Name: string;
  Owner: User;
  MinPlayers: number;
  MaxPlayers?: number;
  DateCreated: Date;
}

export class Game {

  public GameId: string;
  public Name: string;
  public Owner: User;
  public MinPlayers: number;
  public MaxPlayers?: number;
  public DateCreated: Date;

  constructor(obj?: IGame) {
    this.GameId = obj && obj.GameId || "";
    this.Name = obj && obj.Name || "";
    this.Owner = obj && obj.Owner || new User();
    this.MinPlayers = obj && obj.MinPlayers || null;
    this.MaxPlayers = obj && obj.MaxPlayers || null;
    this.DateCreated = obj && obj.DateCreated || new Date();

  }
}