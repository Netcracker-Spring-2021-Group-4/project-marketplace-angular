import {Component, Input, OnInit} from '@angular/core';
import {OrderInfo} from "../../../../shared/models/api/receive/order-info";

@Component({
  selector: 'app-order-customer-info',
  templateUrl: './order-customer-info.component.html',
  styleUrls: ['./order-customer-info.component.scss']
})
export class OrderCustomerInfoComponent implements OnInit {

  @Input() orderCustomerInfo: OrderInfo
  @Input() isLoading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
