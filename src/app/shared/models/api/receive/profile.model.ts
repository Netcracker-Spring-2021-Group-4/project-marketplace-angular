import {UserStatus} from "../send/change-status.model";
import {UserRole} from "../../enums/role.enum";

export class ProfileModel {
  userId: string
  email: string
  firstName: string
  lastName: string
  phoneNumber ?: string
  role : UserRole
  status: UserStatus

  constructor(init: Partial<ProfileModel>) {
    Object.assign(this, init);
  }
}
