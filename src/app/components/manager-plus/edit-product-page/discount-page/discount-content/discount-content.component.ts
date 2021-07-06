import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {DiscountsHttpService} from "../../../../../api-services/discounts-http.service";
import {Discount} from "../../../../../shared/models/api/receive/discount";
import Labels from "../../../../../shared/models/labels/labels.constant";
import {ToasterCustomService} from "../../../../../services/toaster-custom.service";
import {DiscountDeleteConfirmComponent} from "./discount-delete-confirm/discount-delete-confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-discount-content',
  templateUrl: './discount-content.component.html',
  styleUrls: ['./discount-content.component.scss']
})
export class DiscountContentComponent implements OnInit, OnDestroy {

  @Output() getUnexpiredDiscounts: EventEmitter<string> = new EventEmitter<string>()
  @Input() discount: Discount;
  @Input() discounts: Discount[] = [];
  @Input() discountsDatasource: Discount[];
  @Input() isLoading: boolean;
  @Input() myProductId: string | null;
  displayedColumns: string[] = ['offered price', 'starts at', 'ends at', 'delete'];
  dialogSubscription: Subscription;

  constructor(private discountService: DiscountsHttpService,
              private toaster: ToasterCustomService,
              public dialog: MatDialog
  ) { }

  ngOnDestroy(): void {
    if(this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
    }

  ngOnInit(): void {
  }

  public deleteDiscount(discountId: string): void {
    this.discountService.deleteDiscount(discountId).subscribe(
      () => {
        this.toaster.infoNotification(Labels.discount.successfulDeletingDiscount);
        if (this.myProductId !== null) {
          this.getUnexpiredDiscounts.emit(this.myProductId);
        }
      })
  }
  public openDialog(discountId: any) {
    let dialogRef = this.dialog.open(DiscountDeleteConfirmComponent);
    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteDiscount(discountId);
      }else if(!result){
        this.dialog.closeAll();
      }
    })
  }

}
