import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {DiscountsHttpService} from "../../../../../api-services/discounts-http.service";
import {Discount} from "../../../../../shared/models/api/receive/discount";
import Labels from "../../../../../shared/models/labels/labels.constant";
import {ToasterCustomService} from "../../../../../services/toaster-custom.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogConfirmComponent} from "./dialog-confirm/dialog-confirm.component";
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
  private dialogSubsctiption: Subscription;

  constructor(private discountService: DiscountsHttpService,
              private toaster: ToasterCustomService,
              public dialog: MatDialog
  ) { }

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

  openDialog(discountId: any) {
    let dialogRef = this.dialog.open(DialogConfirmComponent);

    this.dialogSubsctiption = dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteDiscount(discountId)
      }else if(!result){
       this.dialog.closeAll()
       }
    })
  }

  ngOnDestroy(): void {
    this.dialogSubsctiption.unsubscribe();
  }
}
