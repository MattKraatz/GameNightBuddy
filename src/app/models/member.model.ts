export interface IMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class Member {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;

  constructor(obj?: IMember) {
    this.id = obj && obj.id || "";
    this.firstName = obj && obj.firstName || "";
    this.lastName = obj && obj.lastName || "";
    this.email = obj && obj.email || "";
  }
}