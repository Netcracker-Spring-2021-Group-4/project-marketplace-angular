import {Component, Input, OnInit} from '@angular/core';
import {CartInfoResponse} from "../../../../shared/models/api/receive/cart-info-response.model";

@Component({
  selector: 'app-shopping-cart-tab',
  templateUrl: './shopping-cart-tab.component.html',
  styleUrls: ['./shopping-cart-tab.component.scss']
})
export class ShoppingCartTabComponent implements OnInit {

  @Input()
  cart: CartInfoResponse

  constructor() { }

  ngOnInit(): void {
  }

}
