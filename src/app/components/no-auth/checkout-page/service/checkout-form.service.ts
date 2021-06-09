import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {Injectable} from "@angular/core";
import {ProfileModel} from "../../../../shared/models/api/receive/profile.model";

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public firstStepForm(obj: Partial<ProfileModel> = {})
    : FormGroup {
    return this.formBuilder.group({
      firstName: name(32, obj.firstName ?? null),
      lastName: name(32, obj.lastName ?? null),
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

  public secondStepForm()
    : FormGroup {
    return this.formBuilder.group({
      deliverySlot: [null, [Validators.required]]
    });
  }

}

const name = (maxLength: number, value?: string | null) => ([value ?? null, [Validators.required, Validators.minLength(2), Validators.maxLength(maxLength)]])
const phoneNumber = (value?: string | null) => ([value ?? null, [Validators.required]])
