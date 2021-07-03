import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-order-filters',
  templateUrl: './order-filters.component.html',
  styleUrls: ['./order-filters.component.scss']
})
export class OrderFiltersComponent implements OnInit {

  @Input() orderForm : FormGroup;

  @Output() orderFilterEvent = new EventEmitter<FormGroup>();

  constructor() {}

  ngOnInit(): void {
  }

  applyFilter() {
    this.orderFilterEvent.emit(this.orderForm);
  }

  resetFilters() {
    this.orderForm.reset();
  }
}
