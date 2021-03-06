import {AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {CustomerOrderModel} from "../../../../shared/models/api/receive/customer-order.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Route} from "../../../../shared/models/enums/route.enum";

@Component({
  selector: 'app-orders-preview-listing',
  templateUrl: './orders-preview-listing.component.html',
  styleUrls: ['./orders-preview-listing.component.scss']
})
export class OrdersPreviewListingComponent implements OnInit, AfterViewInit, OnChanges  {

  @Input() orders: Array<CustomerOrderModel>;
  orders$ : MatTableDataSource<CustomerOrderModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnsToDisplay = ['placedAt', 'deliveryDate', 'deliveryTimeslot', 'orderStatus', 'address', 'phone', 'details']

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() : void {
    this.orders$ = new MatTableDataSource<CustomerOrderModel>(this.orders);
  }

  ngAfterViewInit() {
    this.orders$.paginator = this.paginator;
  }

  getOrderDetailsLink(orderId: string) : string {
    return '/' + Route.ORDER_DETAILS.replace(":id", orderId)
  }
}
