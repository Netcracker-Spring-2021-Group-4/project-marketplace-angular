import { Component, OnInit } from '@angular/core';
import {OrderInfo} from "../../../shared/models/api/receive/order-info";
import {OrderProductInfo} from "../../../shared/models/api/receive/order-product-info";
import {Observable} from "rxjs";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {CourierApiService} from "../../../api-services/courier-http.service";
import {ActivatedRoute} from "@angular/router";
import {RoleService} from "../../../services/role.service";
import {finalize} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderInfo: OrderInfo;
  orderProduct: OrderProductInfo[];
  isLoading: boolean;
  ordersDatasource: any;
  role$: Observable<UserRole>;
  constructor(private courierService: CourierApiService,
              private route: ActivatedRoute,
              private roleService: RoleService
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    const orderId = this.route.snapshot.paramMap.get('id');
    this.role$ = this.roleService.currentRole$
    this.courierService.getOrderDetail(orderId).pipe(finalize(() => {
    })).subscribe(
      (data: OrderInfo) => {
        this.orderInfo = data
        this.orderProduct = data.content
        this.ordersDatasource = new MatTableDataSource(this.orderProduct);
        this.isLoading = false

      }
    )
  }

}
