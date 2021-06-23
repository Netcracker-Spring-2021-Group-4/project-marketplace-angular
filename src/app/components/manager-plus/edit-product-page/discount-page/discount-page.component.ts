import {Component, OnInit} from '@angular/core';
import {Discount} from "../../../../shared/models/api/receive/discount";
import {ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {ValidationMessages} from "../../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import {DiscountsHttpService} from "../../../../api-services/discounts-http.service";
import Labels from "../../../../shared/models/labels/labels.constant";
import {ToasterCustomService} from "../../../../services/toaster-custom.service";
import {ProductsHttpService} from "../../../../api-services/products-http.service";
import {ProductInfo} from "../../../../shared/models/api/receive/productInfo";
import {Observable} from "rxjs";
import {addTimeToDate} from "../../create-auction-page/auction-form.service";

@Component({
  selector: 'app-discount-page',
  templateUrl: './discount-page.component.html',
  styleUrls: ['./discount-page.component.scss'],

})
export class DiscountPageComponent implements OnInit {

  product$: Observable<ProductInfo>;
  myProductId: string | null;
  discountsDatasource: any;
  discounts: Discount[] = [];
  discount: Discount;
  isLoading: boolean = false;
  displayedColumns: string[] = ['offered price', 'starts at', 'ends at', 'delete'];
  discountForm: FormGroup;
  minDate: Date = new Date();
  isIncorrectTime: boolean = false;
  offeredPriceErrorMessage = ValidationMessages.offeredPrice;
  dateTimeInPastErrorMessage = ValidationMessages.dateTimeInPast;
  val: number;

  constructor(
    private discountService: DiscountsHttpService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toaster: ToasterCustomService,
    private productService: ProductsHttpService
  ) {
  }

  ngOnInit(): void {
    this.myProductId = this.route.snapshot.paramMap.get('productId');
    this.product$ = this.productService.getProduct(this.myProductId).pipe(finalize(() => {
      this.isLoading = false;
    }))
    this.discountForm = this.createDiscountForm();
    this.myProductId = this.route.snapshot.paramMap.get('productId');
    this.getUnexpiredDiscounts(this.myProductId);

  }

  public createDiscountForm(): FormGroup {
    return this.formBuilder.group({
      offeredPrice: [null, [Validators.required, Validators.min(0.05), Validators.max(23598)]],
      startsAt: [null, [Validators.required]],
      endsAt: [null, [Validators.required]],
      timeStart: ['03:00', [Validators.required]],
      timeEnd: ['03:00', [Validators.required]]
    },{validators: [this.dateTimeValidator]})
  }

  public getUnexpiredDiscounts(productId: string | null) {
    this.discountService.getUnexpiredDiscounts(productId).pipe(finalize(() => {
      this.isLoading = false
    })).subscribe(
      (response: Discount[]) => {
        this.discounts = response.sort(
          (a, b) =>
            a.startsAt > b.startsAt ? 1 : -1
        );
        this.discountsDatasource = new MatTableDataSource(this.discounts);
      });
  }

  public deleteDiscount(discountId: string): void {
    this.discountService.deleteDiscount(discountId).subscribe(
      () => {
        this.getUnexpiredDiscounts(this.myProductId);
      })
  }

  public dateTimeValidator :ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const date = control.get('startsAt')!.value
    const time = control.get('timeStart')!.value
    const dateWTime = addTimeToDate(date, time)
    return dateWTime > new Date() ? null : {dateTimeInPast: true};
  }


  public submit(discountData: any) {
    const result = this.discountForm.value;
    discountData.startsAt = addTimeToDate(result.startsAt, result.timeStart)
    discountData.endsAt = addTimeToDate(result.endsAt, result.timeEnd)
    discountData.offeredPrice = discountData.offeredPrice * 100;
    this.discountService.createDiscount(this.myProductId, discountData).subscribe(
      () => {
        this.getUnexpiredDiscounts(this.myProductId);
        this.toaster.successfulNotification(Labels.discount.successfulCreationDiscount);
      }, err => {
        this.toaster.errorNotification(err.error.message);
      })

  }

}
