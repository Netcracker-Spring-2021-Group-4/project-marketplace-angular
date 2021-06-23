import {Component, Input, Output, EventEmitter} from '@angular/core';
import {getStringTime, TimeSlotModelFront} from "../../../../shared/models/api/receive/time-slot.model";
import {FormGroup} from "@angular/forms";
import {Moment} from "moment/moment";

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
    this.selectedDate = $event.value.format('YYYY-MM-DD')
    this.dateChangedEvent.emit(this.selectedDate)
  }

  alreadyPassed(value: number[]) {
    return new Date() > new Date(this.getStringTimeFromList(value))
  }

  saveTime() {
    this.formCompletedEvent.emit()
  }

  newSelectedTime($event: any) {
    this.secondStepForm.get('deliverySlot')!.setValue(this.getStringTimeFromList($event.value))
  }

  getStringTimeFromList(value: number[]): string {
    return `${this.selectedDate}T${getStringTime(value)}`
  }
}
