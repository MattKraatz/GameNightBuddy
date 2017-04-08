// Firebase Auth Object
interface IAuth {
  uid: string;
  displayName: string;
  photoURL: string;
  providerId: string;
  email?: string;
  password?: string;
}

export class Auth {

  public uid: string;
  public displayName: string;
  public photoURL: string;
  public providerId: string;
  public email?: string;
  public password?: string;

  constructor(obj?: IAuth) {
    this.uid = obj && obj.uid || "";
    this.displayName = obj && obj.displayName || "";
    this.photoURL = obj && obj.photoURL || "";
    this.providerId = obj && obj.providerId || "";
    this.email = obj && obj.email || "";
    this.password = obj && obj.password || "";
  }
}