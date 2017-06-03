import {User, IUser} from './user.model';

export interface IMember extends IUser {
  MemberId: string;
  IsHost: boolean;
  DateJoined: Date;
}

export class Member extends User {
  
  public MemberId: string;
  public IsHost: boolean;
  public DateJoined: Date;

  constructor(obj?: IMember) {
    super(obj)
    this.MemberId = obj && obj.MemberId || "";
    this.IsHost = obj && obj.IsHost || false;
    this.DateJoined = obj && obj.DateJoined || new Date();
  }
}