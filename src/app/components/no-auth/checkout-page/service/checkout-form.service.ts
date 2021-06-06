import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public firstStepForm(obj: any = {})
    : FormGroup {
    return this.formBuilder.group({
      phoneNumber: phoneNumber(obj.phoneNumber ?? null),
      comment: [null],
      address: this.formBuilder.group({
        city: name(64),
        street: name(64),
        building: name(8),
        flat: [null, [Validators.min(1)]]
      })
    });
  }

}

const name = (maxLength: number, value?: string) => ([value ?? null, [Validators.required, Validators.minLength(2), Validators.maxLength(maxLength)]])
const phoneNumber = (value?: string) => ([value ?? null, [Validators.required]])
