import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ProfileModel} from "../../../../shared/models/api/receive/profile.model";

@Component({
  selector: 'app-profile-page-view',
  templateUrl: './profile-page-view.component.html',
  styleUrls: ['./profile-page-view.component.scss']
})
export class ProfilePageViewComponent{
  @Input()
  profile: ProfileModel
  @Input()
  isCustomerProfileRoute: boolean;
  @Input()
  isStaffProfileRoute: boolean;
  @Input()
  isStaffEditRoute: boolean;
  @Input()
  isFormNeeded: boolean;
  @Output()
  viewActiveEvent = new EventEmitter<void>();
  @Output()
  changePasswordEvent = new EventEmitter<void>();

  constructor() { }

  edit() {
    this.viewActiveEvent.emit()
  }

  goToChangePassword() {
    this.changePasswordEvent.emit()
  }
}
