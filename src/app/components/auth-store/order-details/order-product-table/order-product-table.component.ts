import {Component, Input, OnInit} from '@angular/core';
import {OrderProductInfo} from "../../../../shared/models/api/receive/order-product-info";
import {OrderInfo} from "../../../../shared/models/api/receive/order-info";
import {ToasterCustomService} from "../../../../services/toaster-custom.service";

@Component({
  selector: 'app-order-product-table',
  templateUrl: './order-product-table.component.html',
  styleUrls: ['./order-product-table.component.scss']
})
export class OrderProductTableComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() orderInfo: OrderInfo;
  @Input() orderProduct: OrderProductInfo[];
  @Input() ordersDatasource: any;
  displayedColumns: string[] = ['imageUrl', 'name',  'price',  'productId', 'quantity', 'totalPrice'];

  constructor(private toaster: ToasterCustomService) { }

  ngOnInit(): void {
  }

  isCopied() {
    this.toaster.successfulNotification('Id copied to clipboard')
  }
}
