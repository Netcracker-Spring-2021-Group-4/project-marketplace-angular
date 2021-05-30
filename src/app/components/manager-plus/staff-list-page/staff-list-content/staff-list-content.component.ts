import {Component, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {UserSearchModel} from "../../../../shared/models/api/send/user-search.model";
import {StaffSearchHttpService} from "../../../../api-services/staff-search-http.service";
import {ProfileModel} from "../../../../shared/models/api/receive/profile.model";


@Component({
  selector: 'app-staff-list-content',
  templateUrl: './staff-list-content.component.html',
  styleUrls: ['./staff-list-content.component.scss']
})
export class StaffListContentComponent implements OnInit {

  @Input() matchingStaff: ProfileModel[];

  columnsToDisplay = ['userId', 'email', 'firstName', 'lastName', 'phoneNumber', 'role', 'status'];

  constructor() {
  }

  ngOnInit(): void {
  }

}
