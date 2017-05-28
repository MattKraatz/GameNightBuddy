import {User, IUser} from './user.model';

export interface IMember extends IUser {
  IsHost: boolean;
  DateJoined: Date;
}

export class Member extends User {
  
  public IsHost: boolean;
  public DateJoined: Date;

  constructor(obj?: IMember) {
    super(obj)
    this.IsHost = obj && obj.IsHost || false;
    this.DateJoined = obj && obj.DateJoined || new Date();
  }
}