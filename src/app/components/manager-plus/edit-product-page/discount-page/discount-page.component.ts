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
import {addTimeToDate} from "../../create-auction-page/auction-form.service";

@Component({
  selector: 'app-discount-page',
  templateUrl: './discount-page.component.html',
  styleUrls: ['./discount-page.component.scss'],

})
export class DiscountPageComponent implements OnInit {

  discount: Discount;
  discountForm: FormGroup;
  discounts: Discount[] = [];
  discountsDatasource: MatTableDataSource<Discount>;
  isLoading: boolean = false;
  maxOfferedPrice: number;
  myProductId: string | null;
  product: ProductInfo;
  minDate: Date = new Date();
  dateTimeInPastErrorMessage = ValidationMessages.dateTimeInPast;
  offeredPriceErrorMessage = ValidationMessages.offeredPrice;


  constructor(
    private discountService: DiscountsHttpService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toaster: ToasterCustomService,
    private productService: ProductsHttpService
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.myProductId = this.route.snapshot.paramMap.get('productId');
    if(this.myProductId){
      this.productService.getProduct(this.myProductId).pipe(finalize(() => {
      })).subscribe(
        data => {
          this.product = data;
          this.maxOfferedPrice = (data.price / 100) - 0.01;
          this.discountForm = this.createDiscountForm();
          this.getUnexpiredDiscounts(this.myProductId);
          this.isLoading = false;
        })
    }
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

  public createDiscountForm(): FormGroup {
    return this.formBuilder.group({
      offeredPrice: [null,
        [Validators.required,
        Validators.min(1),
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
    const date = control.get('startsAt')!.value
    const time = control.get('timeStart')!.value
    const dateWTime = addTimeToDate(date, time)
    return dateWTime > new Date() ? null : {dateTimeInPast: true};
  }

  public submit(): void {
    const result = this.discountForm.value;
    result.startsAt = addTimeToDate(result.startsAt, result.timeStart)
    result.endsAt = addTimeToDate(result.endsAt, result.timeEnd)
    result.offeredPrice = result.offeredPrice * 100;
    this.discountService.createDiscount(this.myProductId, result)
      .pipe(finalize (() => {
        this.isLoading = false;
        this.discountForm.markAsUntouched()
        this.discountForm.get('timeStart')?.patchValue('03:00')
        this.discountForm.get('timeEnd')?.patchValue('03:00')
      })).subscribe(
      () => {
        this.getUnexpiredDiscounts(this.myProductId);
        this.toaster.successfulNotification(Labels.discount.successfulCreationDiscount);
      }, err => {
        this.toaster.errorNotification(err.error.message);
      })
  }


}
