import {User, IUser} from './user.model';

export interface IGameRecRequest {
  RequestingUserId: string;
  GameNightId: string;
  UserIds: string[];
}

export class GameRecRequest {
  
  public RequestingUserId: string;
  public GameNightId: string;
  public UserIds: string[];

  constructor(obj?: IGameRecRequest) {
    this.RequestingUserId = obj && obj.RequestingUserId || "";
    this.GameNightId = obj && obj.GameNightId || "";
    this.UserIds = obj && obj.UserIds || new Array<string>();
  }
}