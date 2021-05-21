export class UpdatePasswordWrapper{
  currentPassword: string
  newPassword: string

  constructor(init: Partial<UpdatePasswordWrapper>) {
    Object.assign(this, init);
  }
}
