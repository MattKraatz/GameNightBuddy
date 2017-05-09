export interface ILoginViewModel {
    Email?: string;
    Password?: string;
    ConfirmPassword?: string;
}

export class LoginViewModel implements ILoginViewModel {
  public Email?: string;
  public Password?: string;
  public ConfirmPassword?: string;

  constructor(obj?: ILoginViewModel) {
    this.Email = obj && obj.Email || "";
    this.Password = obj && obj.Password || "";
    this.ConfirmPassword = obj && obj.ConfirmPassword || "";
  }
}