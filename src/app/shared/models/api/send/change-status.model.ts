export class ChangeStatusModel {
  email : string
  userStatus : UserStatus

  constructor(init: Partial<ChangeStatusModel>) {
    Object.assign(this, init);
  }
}

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'UNCONFIRMED'
