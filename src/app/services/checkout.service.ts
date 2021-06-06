import {Injectable} from "@angular/core";
import {CartInfoResponse} from "../shared/models/api/receive/cart-info-response.model";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  cart: CartInfoResponse | null = null;

  get isReserved() {
    return this.cart != null;
  }

  setReserved(cart: CartInfoResponse) {
    this.cart = Object.freeze(cart);
  }

  removeReservation() {
    this.cart = null
  }

}
