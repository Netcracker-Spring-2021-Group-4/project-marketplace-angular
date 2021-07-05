import { Component, OnInit } from '@angular/core';
import {OrderInfo} from "../../../shared/models/api/receive/order-info";
import {OrderProductInfo} from "../../../shared/models/api/receive/order-product-info";
import {Observable} from "rxjs";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {CourierApiService} from "../../../api-services/courier-http.service";
import {ActivatedRoute} from "@angular/router";
import {RoleService} from "../../../services/role.service";
import {MatTableDataSource} from "@angular/material/table";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderInfo: OrderInfo;
  orderProduct: OrderProductInfo[];
  isLoading: boolean;
  ordersDatasource: MatTableDataSource<OrderProductInfo>;
  role$: Observable<UserRole>;
  constructor(private courierService: CourierApiService,
              private route: ActivatedRoute,
              private roleService: RoleService,
              private titleService: Title
  ) {
    this.titleService.setTitle("Order Details")
  }

  ngOnInit(): void {
    this.isLoading = true;
    const orderId = this.route.snapshot.paramMap.get('id');
    this.role$ = this.roleService.currentRole$
    this.courierService.getOrderDetail(orderId).subscribe(
      (data: OrderInfo) => {
        this.orderInfo = data
        this.orderProduct = data.content
        this.ordersDatasource = new MatTableDataSource(this.orderProduct);
        this.isLoading = false
      }
    )
  }

}
