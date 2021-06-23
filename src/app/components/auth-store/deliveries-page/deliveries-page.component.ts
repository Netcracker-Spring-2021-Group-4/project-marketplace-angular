import {Component, OnInit} from '@angular/core';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {CourierApiService} from "../../../api-services/courier-http.service";
import {DeliveryModel} from "../../../shared/models/api/receive/delivery.model";
import {catchError} from "rxjs/operators";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {Route} from "../../../shared/models/enums/route.enum";
import {Moment} from "moment";
import * as moment from 'moment';




@Component({
  selector: 'app-deliveries-page',
  templateUrl: './deliveries-page.component.html',
  styleUrls: ['./deliveries-page.component.scss']
})
export class DeliveriesPageComponent implements OnInit {
  dateStart:Moment
  deliveries: DeliveryModel[];
  displayedColumns: string[] = ['time', 'phoneNumber', 'name', 'address','status','open', 'show'];


  events: string[] = [];




  constructor(private courierService:CourierApiService, private toaster:ToasterCustomService) {
    this.dateStart= moment();

  }

  ngOnInit(): void {
    this.courierService.getDeliveries(this.dateStart.format('YYYY-MM-DD'))
      .subscribe(deliveryModels => {
        this.deliveries=deliveryModels;
      });
  }



  changeStatus(id:string, status:string) {

    this.courierService.changeStatus(status,id).pipe(
      catchError<any, any>(error => {
        this.toaster.errorNotification(error?.message ?? 'Could not cancel change state of the order.')
      })
    ).subscribe(()=>{
      this.ngOnInit();
    });
  }

  getOrderDetailsLink(orderId: string) : string {
    return '/' + Route.ORDER_DETAILS.replace(':id', orderId);
  }

  dateValueChange(event: MatDatepickerInputEvent<Moment>) {
    if(event.value!=null){
    let date =event.value.format('YYYY-MM-DD');
      this.courierService.getDeliveries(date)
        .subscribe(deliveryModels => {
          this.deliveries = deliveryModels;
        });
    }
  }



}
