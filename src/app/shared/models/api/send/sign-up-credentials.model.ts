export class SignUpCredentials {
  email : string
  plainPassword : string
  firstName: string
  lastName: string
  phoneNumber ?: string

  constructor(init: Partial<SignUpCredentials>) {
    Object.assign(this, init);
  }
}
