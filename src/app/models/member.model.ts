import {Auth, IAuth} from './auth.model';

export interface IMember extends IAuth {
  dateJoined: string;
}

export class Member extends Auth {
  
  public dateJoined: string;

  constructor(obj?: IMember) {
    super(obj)
    this.dateJoined = obj && obj.dateJoined || Date.now().toString();
  }
}