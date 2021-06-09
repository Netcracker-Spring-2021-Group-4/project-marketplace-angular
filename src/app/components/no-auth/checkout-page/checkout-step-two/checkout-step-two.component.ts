import {Component, Input, Output, EventEmitter} from '@angular/core';
import {getStringTime, TimeSlotModelFront} from "../../../../shared/models/api/receive/time-slot.model";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-checkout-step-two',
  templateUrl: './checkout-step-two.component.html',
  styleUrls: ['./checkout-step-two.component.scss']
})
export class CheckoutStepTwoComponent{

  @Input()
  timeslots: TimeSlotModelFront[]
  @Input()
  secondStepForm: FormGroup;
  @Output()
  dateChangedEvent = new EventEmitter<string>()
  @Output()
  formCompletedEvent = new EventEmitter<void>()

  minDate = new Date();
  selectedDate: string

  constructor() { }

  dateChanged($event: any) {
    this.secondStepForm.get('deliverySlot')!.setValue(null);
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
    this.formCompletedEvent.emit()
  }

  newSelectedTime($event: any) {
    console.log($event)
    this.secondStepForm.get('deliverySlot')!.setValue(this.getStringTimeFromList($event.value))
  }

  getStringTimeFromList(value: number[]): string {
    return `${this.selectedDate}T${getStringTime(value)}`
  }
}
