import {Auth, IAuth} from './auth.model';

export interface IMember extends IAuth {
  id: string;
  dateJoined: string;
}

export class Member extends Auth {
  
  public id: string;
  public dateJoined: string;

  constructor(obj?: IMember) {
    super(obj)
    this.id = obj && obj.id || "";
    this.dateJoined = obj && obj.dateJoined || Date.now().toString();
  }
}