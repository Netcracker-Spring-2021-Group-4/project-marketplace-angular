import {
  AbstractControl,
  FormBuilder,
  FormGroup, ValidationErrors, ValidatorFn,
  Validators
} from "@angular/forms";
import {Injectable} from "@angular/core";
import {isValidUUID} from "../../../shared/helpers/util-functions.helper";

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
      startsAtTime: [null, [Validators.required]],
      startPriceDollars: [null, [Validators.required, Validators.min(100)]],
      productQuantity: [null, [Validators.required, Validators.min(3)]],
      productId: [null, [Validators.required, UUIDValidator]],
      typeId: [null, [Validators.required, Validators.min(1)]],
    });
  }

  public descendingJsonDetails()
    : FormGroup {
    return this.formBuilder.group({
      loweringStep: [null, [Validators.required, Validators.min(5)]],
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
  const id = control.get('productId')?.value
  return isValidUUID(id) ? null : {UUIDInvalid: true};
}
