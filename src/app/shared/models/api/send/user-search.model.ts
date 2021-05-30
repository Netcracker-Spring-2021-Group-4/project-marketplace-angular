export class UserSearchModel {
  firstNameSeq ?: string;
  lastNameSeq ?: string;
  targetRoles ?: string[];
  targetStatuses ?: string[];

  constructor(init: Partial<UserSearchModel>) {
    Object.assign(this, init);
  }
}
