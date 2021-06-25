import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {DiscountsHttpService} from "../../../../../api-services/discounts-http.service";
import {Discount} from "../../../../../shared/models/api/receive/discount";

@Component({
  selector: 'app-discount-content',
  templateUrl: './discount-content.component.html',
  styleUrls: ['./discount-content.component.scss']
})
export class DiscountContentComponent implements OnInit {

  @Output() getUnexpiredDiscounts: EventEmitter<string> = new EventEmitter<string>()
  @Input() discount: Discount;
  @Input() discounts: Discount[] = [];
  @Input() discountsDatasource: Discount[];
  @Input() isLoading: boolean;
  @Input() myProductId: string | null;
  displayedColumns: string[] = ['offered price', 'starts at', 'ends at', 'delete'];

  constructor(private discountService: DiscountsHttpService) { }

  ngOnInit(): void {
  }

  public deleteDiscount(discountId: string): void {
    this.discountService.deleteDiscount(discountId).subscribe(
      () => {
        if (this.myProductId !== null) {
          this.getUnexpiredDiscounts.emit(this.myProductId);
        }
      })
  }

}
