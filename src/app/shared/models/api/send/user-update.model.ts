export class UserUpdateModel {
  email : string
  firstName: string
  lastName: string
  phoneNumber ?: string

  constructor(init: Partial<UserUpdateModel>) {
    Object.assign(this, init);
  }
}
