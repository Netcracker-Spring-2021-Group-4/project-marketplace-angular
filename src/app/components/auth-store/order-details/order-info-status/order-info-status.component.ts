import {Component, Input, OnInit} from '@angular/core';
import {OrderInfo} from "../../../../shared/models/api/receive/order-info";

@Component({
  selector: 'app-order-info-status',
  templateUrl: './order-info-status.component.html',
  styleUrls: ['./order-info-status.component.scss']
})
export class OrderInfoStatusComponent implements OnInit {

  @Input() order: OrderInfo
  @Input() isLoading: boolean;
  constructor() { }

  ngOnInit(): void {
  }
}
