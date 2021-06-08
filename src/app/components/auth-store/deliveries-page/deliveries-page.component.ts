import { Component, OnInit } from '@angular/core';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {CourierApiService} from "../../../api-services/courier-http.service";
import {DeliveryModel} from "../../../shared/models/api/receive/delivery.model";

@Component({
  selector: 'app-deliveries-page',
  templateUrl: './deliveries-page.component.html',
  styleUrls: ['./deliveries-page.component.scss']
})
export class DeliveriesPageComponent implements OnInit {
  deliveries: DeliveryModel[];
  displayedColumns: string[] = ['time', 'phoneNumber', 'name', 'address','status','open'];

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
          console.log(deliveryModels)
        });
    }


    this.events.push(`${type}: ${event.value}`);

  }

  constructor(private courierService:CourierApiService) {
  }

  ngOnInit(): void {
    this.courierService.getDeliveries(new Date())
      .subscribe(deliveryModels => {
        this.deliveries=deliveryModels;
        console.log(deliveryModels)
      });
  }

}
