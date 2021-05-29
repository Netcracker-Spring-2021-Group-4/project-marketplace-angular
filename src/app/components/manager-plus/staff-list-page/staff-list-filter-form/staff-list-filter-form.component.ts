import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-staff-list-filter-form',
  templateUrl: './staff-list-filter-form.component.html',
  styleUrls: ['./staff-list-filter-form.component.scss']
})
export class StaffListFilterFormComponent implements OnInit {

  @Input() staffFilterForm: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
  }

  @Output() searchCriteriaEvent = new EventEmitter<FormGroup>();

  search(): void {
    this.searchCriteriaEvent.emit(this.staffFilterForm);
  };
}
