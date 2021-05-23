import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ValidationMessages} from "../../../../shared/models/labels/validation.message";
import {FormGroup} from "@angular/forms";
import {UserStatus} from "../../../../shared/models/api/send/change-status.model";
import {UserUpdateModel} from "../../../../shared/models/api/send/user-update.model";

@Component({
  selector: 'app-profile-page-form',
  templateUrl: './profile-page-form.component.html',
  styleUrls: ['./profile-page-form.component.scss']
})
export class ProfilePageFormComponent{
  @Input()
  form: FormGroup;
  @Input()
  status: UserStatus;
  @Input()
  isLoading: boolean;
  @Input()
  isStaffCreateRoute: boolean;
  @Input()
  isStaffEditRoute: boolean;
  @Input()
  isCustomerProfileRoute: boolean;
  @Input()
  formTitle: string;
  @Input()
  formBtnMessage: string;
  @Output()
  staffCreateEvent = new EventEmitter<any>();
  @Output()
  staffEditEvent = new EventEmitter<UserUpdateModel>();
  @Output()
  customerEditEvent = new EventEmitter<UserUpdateModel>();
  @Output()
  statusChangeEvent = new EventEmitter<UserStatus>();
  @Output()
  viewActiveEvent = new EventEmitter<void>();


  emailErrorMessage = ValidationMessages.email
  passwordErrorMessage = ValidationMessages.password
  firstNameErrorMessage = ValidationMessages.firstName
  lastNameErrorMessage = ValidationMessages.lastName
  phoneNumberErrorMessage = ValidationMessages.phoneNumber
  titles = [
    {value: 'mng', label: 'Product manager'},
    {value: 'del', label: 'Courier'}
  ]
  statuses = [
    {value: 'ACTIVE', label: 'Active'},
    {value: 'INACTIVE', label: 'Inactive'},
    {value: 'TERMINATED', label: 'Terminated'}
  ]

  submit() {
    if(this.isStaffCreateRoute) this.staffCreateEvent.emit(this.form.value)
    else if (this.isStaffEditRoute) {
      const obj = this.form.value
      delete obj.status
      obj.email = this.form.get('email')!.value
      this.staffEditEvent.emit(obj)
    } else if (this.isCustomerProfileRoute) {
      this.customerEditEvent.emit(this.form.value)
    }
  }

  statusChanged($event: any) {
    this.statusChangeEvent.emit($event.value)
  }

  back() {
    this.viewActiveEvent.emit()
  }
}
