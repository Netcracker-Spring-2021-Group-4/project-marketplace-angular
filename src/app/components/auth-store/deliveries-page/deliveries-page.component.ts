import {Component, OnInit} from '@angular/core';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {CourierApiService} from "../../../api-services/courier-http.service";
import {DeliveryModel} from "../../../shared/models/api/receive/delivery.model";
import {catchError} from "rxjs/operators";
import {ToasterCustomService} from "../../../services/toaster-custom.service";


@Component({
  selector: 'app-deliveries-page',
  templateUrl: './deliveries-page.component.html',
  styleUrls: ['./deliveries-page.component.scss']
})
export class DeliveriesPageComponent implements OnInit {
  dateStart:Date
  deliveries: DeliveryModel[];
  displayedColumns: string[] = ['time', 'phoneNumber', 'name', 'address','status','open', 'show'];

  myFilter = (d: Date | null): boolean => {
    const date = (d || new Date());
    return (date.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))
     }
  events: string[] = [];


  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if(event.value!=null) {
      this.courierService.getDeliveries(event.value)
        .subscribe(deliveryModels => {
          this.deliveries = deliveryModels;
        });
    }


    this.events.push(`${type}: ${event.value}`);

  }

  constructor(private courierService:CourierApiService, private toaster:ToasterCustomService) {
    this.dateStart=new Date();
  }

  ngOnInit(): void {
    this.courierService.getDeliveries(new Date())
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


}
