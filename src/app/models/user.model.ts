import {Game} from './game.model';
import {GameNight} from './game-night.model';

export interface IUser {
  UserId: string;
  DisplayName: string;
  PhotoURL: string;
  Email: string;
  Games: Game[];
  GameNights: GameNight[];
}

export class User {

  public UserId: string;
  public DisplayName: string;
  public PhotoURL: string;
  public Email: string;
  public Games: Game[];
  public GameNights: GameNight[];

  constructor(obj?: IUser) {
    this.UserId = obj && obj.UserId || "";
    this.DisplayName = obj && obj.DisplayName || "";
    this.PhotoURL = obj && obj.PhotoURL || "";
    this.Email = obj && obj.Email || "";
    this.Games = obj && obj.Games || new Array<Game>();
    this.GameNights = obj && obj.GameNights || new Array<GameNight>();
  }
}