import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {addTimeToDate} from "../../create-auction-page/auction-form.service";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-discount-page',
  templateUrl: './discount-page.component.html',
  styleUrls: ['./discount-page.component.scss'],

})
export class DiscountPageComponent implements OnInit, OnDestroy {

  discount: Discount;
  discountForm: FormGroup;
  discounts: Discount[] = [];
  discountsDatasource: MatTableDataSource<Discount>;
  isLoading: boolean = false;
  maxOfferedPrice: number;
  myProductId: string;
  product: ProductInfo;
  minDate: Date = new Date();
  dateTimeInPastErrorMessage = ValidationMessages.dateTimeInPast;
  minOfferedPriceErrorMessage = ValidationMessages.offeredPriceMin;
  maxOfferedPriceErrorMessage = ValidationMessages.offeredPriceMax;
  requiredErrorMessage = ValidationMessages.required;
  private subscriptions: Subscription[] = [];

  constructor(
    private discountService: DiscountsHttpService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toaster: ToasterCustomService,
    private productService: ProductsHttpService,
    private titleService: Title
  ) {
  }

   ngOnInit(): void {
    this.isLoading = true;
    const myProductId = this.route.snapshot.paramMap.get('productId');
    if(myProductId){
      this.subscriptions.push(this.productService.getProduct(myProductId).subscribe(
        data => {
          this.product = data;
          this.titleService.setTitle(`Edit discounts for ${this.product.name}`);
          this.maxOfferedPrice = (data.price / 100) - 0.01;
          this.discountForm = this.createDiscountForm();
            this.getUnexpiredDiscounts(myProductId);
          this.isLoading = false;
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscriptions) => subscriptions.unsubscribe()
    );
    this.subscriptions = [];
  }


  public getUnexpiredDiscounts(productId: string) {
    this.subscriptions.push(this.discountService.getUnexpiredDiscounts(productId).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(
      (response: Discount[]) => {
        this.discounts = response.sort(
          (a, b) =>
            a.startsAt > b.startsAt ? 1 : -1
        );
        this.discountsDatasource = new MatTableDataSource(this.discounts);
      }));
  }

  public createDiscountForm(): FormGroup {
    return this.formBuilder.group({
      offeredPrice: [null,
        [Validators.required,
        Validators.min(0.05),
        Validators.max(this.maxOfferedPrice)
        ]
      ],
      startsAt: [null, [Validators.required]],
      endsAt: [null, [Validators.required]],
      timeStart: ['03:00', [Validators.required]],
      timeEnd: ['03:00', [Validators.required]]
    },{validators: [this.dateTimeValidator]})
  }

  public dateTimeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const date = control.get('startsAt')!.value;
    const time = control.get('timeStart')!.value;
    const dateWTime = addTimeToDate(date, time);
    return dateWTime > new Date() ? null : {dateTimeInPast: true};
  }

  public submit(): void {
    this.isLoading = true;
    const result = this.discountForm.value;
    result.startsAt = addTimeToDate(result.startsAt, result.timeStart);
    result.endsAt = addTimeToDate(result.endsAt, result.timeEnd);
    result.offeredPrice = result.offeredPrice * 100;
    this.subscriptions.push(this.discountService.createDiscount(this.product.productId, result)
      .pipe(finalize (() => {
        this.isLoading = false;
        this.discountForm.get('timeStart')?.patchValue('03:00');
        this.discountForm.get('timeEnd')?.patchValue('03:00');
      })).subscribe(
      () => {
        this.getUnexpiredDiscounts(this.product.productId);
        this.toaster.successfulNotification(Labels.discount.successfulCreationDiscount);
      }, err => {
        this.toaster.errorNotification(err.error.message);
      }));
    this.discountForm.reset();
  }

}
