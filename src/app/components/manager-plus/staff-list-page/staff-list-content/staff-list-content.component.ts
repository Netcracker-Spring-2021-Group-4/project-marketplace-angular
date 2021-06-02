import {Component, Input, OnInit} from '@angular/core';
import {ProfileModel} from "../../../../shared/models/api/receive/profile.model";


@Component({
  selector: 'app-staff-list-content',
  templateUrl: './staff-list-content.component.html',
  styleUrls: ['./staff-list-content.component.scss']
})
export class StaffListContentComponent implements OnInit {

  @Input() matchingStaff: ProfileModel[];

  columnsToDisplay = ['userId', 'email', 'firstName', 'lastName', 'phoneNumber', 'role', 'status', 'actions'];

  constructor() {
  }

  ngOnInit(): void {
  }

}
