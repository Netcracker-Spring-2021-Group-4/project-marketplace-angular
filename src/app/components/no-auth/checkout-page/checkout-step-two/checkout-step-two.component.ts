import {Component, Input, Output, EventEmitter} from '@angular/core';
import {getStringTime, TimeSlotModelFront} from "../../../../shared/models/api/receive/time-slot.model";

@Component({
  selector: 'app-checkout-step-two',
  templateUrl: './checkout-step-two.component.html',
  styleUrls: ['./checkout-step-two.component.scss']
})
export class CheckoutStepTwoComponent{

  @Input()
  timeslots: TimeSlotModelFront[]
  @Output()
  dateChangedEvent = new EventEmitter<string>()
  @Output()
  timeSelectedEvent = new EventEmitter<string>()

  minDate = new Date();
  time: number[] | null= null;
  selectedDate: string

  constructor() { }

  dateChanged($event: any) {
    this.time = null
    this.selectedDate = this.formatDate($event.value)
    this.dateChangedEvent.emit(this.selectedDate)
  }

  formatDate(date: Date) {
    let month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  saveTime() {
    const res = `${this.selectedDate}T${getStringTime(this.time!)}`
    this.timeSelectedEvent.emit(res)
  }
}
