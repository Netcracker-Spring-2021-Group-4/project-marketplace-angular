import {Component, Input, OnInit} from '@angular/core';
import {OrderProductInfo} from "../../../../shared/models/api/receive/order-product-info";
import {OrderInfo} from "../../../../shared/models/api/receive/order-info";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-order-product-table',
  templateUrl: './order-product-table.component.html',
  styleUrls: ['./order-product-table.component.scss']
})
export class OrderProductTableComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() orderInfo: OrderInfo;
  @Input() orderProduct: OrderProductInfo[];
  @Input() ordersDatasource: MatTableDataSource<OrderProductInfo>;
  displayedColumns: string[] = ['imageUrl', 'name',  'price',  'productId', 'quantity', 'totalPrice'];

  constructor() { }

  ngOnInit(): void {
  }

}
