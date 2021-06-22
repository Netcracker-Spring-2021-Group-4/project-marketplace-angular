import { Injectable } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ProdMgrService {

  constructor(private formBuilder: FormBuilder) { }

  public staffSearchForm(): FormGroup {
    return this.formBuilder.group({
      firstName: optionalName(),
      lastName: optionalName(),
      isRoleCourier: new FormControl(false),
      isRolePM: new FormControl(false),
      isStatusInactive: new FormControl(false),
      isStatusActive: new FormControl(false),
      isStatusTerminated: new FormControl(false),
      isStatusUnconfirmed: new FormControl(false)
    });
  }

}

const optionalName = (value?: string) => ([value ?? null, [Validators.minLength(2), Validators.maxLength(30)]])
