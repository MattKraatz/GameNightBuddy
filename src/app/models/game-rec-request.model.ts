import {User, IUser} from './user.model';

export interface IGameRecRequest {
  GameNightId: string;
  UserIds: string[];
}

export class GameRecRequest {
  
  public GameNightId: string;
  public UserIds: string[];

  constructor(obj?: IGameRecRequest) {
    this.GameNightId = obj && obj.GameNightId || "";
    this.UserIds = obj && obj.UserIds || new Array<string>();
  }
}