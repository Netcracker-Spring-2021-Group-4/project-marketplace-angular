import {Component, Input, OnInit} from '@angular/core';
import {ProfileModel} from "../../../../shared/models/api/receive/profile.model";
import {Route} from "../../../../shared/models/enums/route.enum";

@Component({
  selector: 'app-staff-list-content',
  templateUrl: './staff-list-content.component.html',
  styleUrls: ['./staff-list-content.component.scss']
})
export class StaffListContentComponent implements OnInit {

  @Input() matchingStaff$: ProfileModel[];

  columnsToDisplay = ['firstName', 'lastName', 'email', 'phoneNumber', 'role', 'status', 'edit'];

  constructor() {
  }

  ngOnInit(): void {
  }

  getEditLink(userId: string) : string {
    return '/' + Route.STAFF_PROFILE.replace(':id', userId);
  }

  getNewStafferLink() : string {
    return '/' + Route.STAFF_CREATE;
  }
}
