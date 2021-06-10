import {Component, OnInit} from '@angular/core';
import {Discount} from "../../../../shared/models/api/receive/discount";
import {ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {DiscountModel} from "../../../../shared/models/api/send/discount-model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationMessages} from "../../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import {DiscountsHttpService} from "../../../../api-services/discounts-http.service";


@Component({
  selector: 'app-discount-page',
  templateUrl: './discount-page.component.html',
  styleUrls: ['./discount-page.component.scss']
})
export class DiscountPageComponent implements OnInit {
  myProductId: string | null;
  discountsDatasource: any;
  discounts: Discount[] = [];
  discount: Discount;
  isLoading: boolean = false;
  displayedColumns: string[] = ['offered price', 'starts at', 'ends at', 'delete'];
  discountForm: FormGroup;
  offeredPriceErrorMessage = ValidationMessages.offeredPrice
  startAtErrorMessage = ValidationMessages.startAt
  endsAtErrorMessage = ValidationMessages.endsAt
  requiredErrorMessage = ValidationMessages.required;

  constructor(
    private discountService: DiscountsHttpService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.isLoading = true;
    this.discountForm = this.createDiscountForm();
    this.myProductId = this.route.snapshot.paramMap.get('productId');
    this.getUnexpiredDiscounts(this.myProductId);
  }


  public createDiscountForm(): FormGroup {
    return this.formBuilder.group({
      offeredPrice: offeredPrice(),
      startsAt: startsAt(),
      endsAt: endsAt()
    })
  }

  public getUnexpiredDiscounts(productId: string | null) {
    this.discountService.getUnexpiredDiscounts(productId).pipe(finalize(() => {
      this.isLoading = false
    })).subscribe(
      (response: Discount[]) => {
        this.discounts = response;
        this.discountsDatasource = new MatTableDataSource(this.discounts);
      },
      error => {
        console.log(error)
      }
    );
  }

  public deleteDiscount(discountId: string): void {
    this.discountService.deleteDiscount(discountId).subscribe(
      () => {
        this.getUnexpiredDiscounts(this.myProductId);
      })
  }

  public submit() {
    this.discountForm
      .patchValue({offeredPrice: this.discountForm.get('offeredPrice')?.value * 100})
    const discountData = this.discountForm.value;
    console.log(discountData)
    this.discountService.createDiscount(this.myProductId, discountData).subscribe(
      (response: DiscountModel) => {
        this.getUnexpiredDiscounts(this.myProductId);
      }
    )
    if (this.discountForm.valid) {
      this.discountForm.reset();
    }
  }
}

const offeredPrice = (value?: number) => ([value ?? null, [Validators.required, Validators.min(0)]]);
const startsAt = (value?: Date) => ([value ?? null, [Validators.required]]);
const endsAt = (value?: Date) => ([value ?? null, [Validators.required]]);






