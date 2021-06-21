import {
  AbstractControl,
  FormBuilder,
  FormGroup, ValidationErrors, ValidatorFn,
  Validators
} from "@angular/forms";
import {Injectable} from "@angular/core";
import {isValidUUID} from "../../../shared/helpers/util-functions.helper";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuctionFormService {

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public auctionCreateForm()
    : FormGroup {
    return this.formBuilder.group({
      startsAtDate: [null, [Validators.required]],
      startsAtTime: ['03:00', [Validators.required]],
      startPriceDollars: [null, [Validators.required, Validators.min(100), Validators.max(120_567)]],
      productQuantity: [null, [Validators.required, Validators.min(3)]],
      productId: [null, [Validators.required, UUIDValidator]],
      typeId: [null, [Validators.required, Validators.min(1)]],
    }, {validators: [dateTimeValidator]});
  }

  public descendingJsonDetails()
    : FormGroup {
    return this.formBuilder.group({
      loweringStepDollars: [null, [Validators.required, Validators.min(0.05)]],
      stepPeriod: [null, [Validators.required, Validators.min(60)]],
      numSteps: [null, [Validators.required, Validators.min(1)]],
    })
  }
  public ascendingJsonDetails()
    : FormGroup {
    return this.formBuilder.group({
      timeToBid: [null, [Validators.required, Validators.min( 10)]],
      minRiseDollars: [null, [Validators.required, Validators.min(5)]],
    })
  }

  addJsonDetails(form: FormGroup, type: string) {
    const control = type === 'ASCENDING' ? this.ascendingJsonDetails() : this.descendingJsonDetails();
    form.addControl('jsonDetails', control)
  }
}

const UUIDValidator :ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const id = control.value
  return isValidUUID(id) ? null : {UUIDInvalid: true};
}

const dateTimeValidator :ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const date = control.get('startsAtDate')!.value
  const time = control.get('startsAtTime')!.value
  const dateWTime = addTimeToDate(date, time)

  return dateWTime > new Date() ? null : {dateTimeInPast: true};
}

export const addTimeToDate = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':')
  return moment(date).add(hours, "hours").add(minutes, 'minutes').toDate()
}
