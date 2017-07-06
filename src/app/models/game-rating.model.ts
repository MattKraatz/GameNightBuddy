import {User, IUser} from './user.model';

export interface IGameRating {
  UserId: string;
  GameId: string;
  Rating: number;
}

export class GameRating {
  
  public UserId: string;
  public GameId: string;
  public Rating: number;

  constructor(obj?: IGameRating) {
    this.UserId = obj && obj.UserId || "";
    this.GameId = obj && obj.GameId || "";
    this.Rating = obj && obj.Rating || 0;
  }
}