import {Injectable} from "@angular/core";
import {CartInfoResponse} from "../shared/models/api/receive/cart-info-response.model";
import {finalize} from "rxjs/operators";
import Labels from "../shared/models/labels/labels.constant";
import {PublicApiService} from "../api-services/public-http.service";
import {ToasterCustomService} from "./toaster-custom.service";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  cart: CartInfoResponse | null = null;

  constructor(
    private publicApiService: PublicApiService,
    private toaster: ToasterCustomService
  ) {}

  get isReserved() {
    return this.cart != null;
  }

  setReserved(cart: CartInfoResponse) {
    this.cart = Object.freeze(cart);
  }

  removeReservation() {
    this.cart = null
  }

  cancelReservationOnline(finalizeCall: ()=> void) {
    this.publicApiService
      .cancelReservation(this.cart!.content)
      .pipe(
        finalize(finalizeCall)
      )
      .subscribe( _ => {
        this.toaster.successfulNotification(Labels.cart.successfulReservationRemoved)
        this.removeReservation()
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })
  }

}
