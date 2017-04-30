export interface ILoginViewModel {
    Email: string;
    Password: string;
}

export class LoginViewModel {
  public Email?: string;
  public Password?: string;

  constructor(obj?: ILoginViewModel) {
    this.Email = obj && obj.Email || "";
    this.Password = obj && obj.Password || "";
  }
}