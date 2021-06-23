import {Component, Input, OnInit} from '@angular/core';
import {OrderInfo} from "../../../../shared/models/api/receive/order-info";
import {ToasterCustomService} from "../../../../services/toaster-custom.service";

@Component({
  selector: 'app-order-info-status',
  templateUrl: './order-info-status.component.html',
  styleUrls: ['./order-info-status.component.scss']
})
export class OrderInfoStatusComponent implements OnInit {

  @Input() order: OrderInfo
  @Input() isLoading: boolean;
  constructor(private toaster: ToasterCustomService ) { }

  ngOnInit(): void {
  }

  isCopied() {
    this.toaster.successfulNotification('Id copied to clipboard')
  }
}
