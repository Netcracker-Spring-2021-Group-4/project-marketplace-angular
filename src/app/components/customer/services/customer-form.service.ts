import { Injectable } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CustomerFormService {

  constructor(private formBuilder: FormBuilder) { }

  public orderFilterForm(): FormGroup {
    return this.formBuilder.group({
      placedDateStart: date(),
      placedDateEnd: date(),
      deliveryDateStart : date(),
      deliveryDateEnd : date(),
      isStatusSubmitted : new FormControl(false),
      isStatusInDelivery : new FormControl(false),
      isStatusInDelivered : new FormControl(false),
      isStatusInCancelled : new FormControl(false),
      isStatusInFailed : new FormControl(false),
    });
  }
}

const date = (value?: string) => ([value ?? null, [(control: AbstractControl) =>
  control.value !== null && isNaN(Date.parse(control.value)) ? {"invalidDate" : true} : null
]])

// const date = (value?: string) => ([value ?? null, [value !== undefined && isNaN(Date.parse(value))]])
