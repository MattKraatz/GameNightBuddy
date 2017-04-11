// Firebase Auth Object
export interface IAuth {
  // Firebase
  uid: string;
  displayName: string;
  photoURL: string;
  providerId: string;
  email?: string;
  password?: string;

  // Custom
  firstName?: string;
  lastName?: string;
}

export class Auth {

  public uid: string;
  public displayName: string;
  public photoURL: string;
  public providerId: string;
  public email?: string;
  public password?: string;

  public firstName?: string;
  public lastName?: string;

  constructor(obj?: IAuth) {
    this.uid = obj && obj.uid || "";
    this.displayName = obj && obj.displayName || "";
    this.photoURL = obj && obj.photoURL || "";
    this.providerId = obj && obj.providerId || "";
    this.email = obj && obj.email || "";
    this.password = obj && obj.password || "";
    this.firstName = obj && obj.firstName || "";
    this.lastName = obj && obj.lastName || "";
  }
}