export class LoginCredentials {
  username : string
  password : string

  constructor(init: Partial<LoginCredentials>) {
    Object.assign(this, init);
  }
}
