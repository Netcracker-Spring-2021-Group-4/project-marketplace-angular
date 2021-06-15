import {Component, OnInit} from '@angular/core';
import {Discount} from "../../../../shared/models/api/receive/discount";
import {ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {DiscountModel} from "../../../../shared/models/api/send/discount-model";
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ValidationMessages} from "../../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import {DiscountsHttpService} from "../../../../api-services/discounts-http.service";
import Labels from "../../../../shared/models/labels/labels.constant";
import {ToasterCustomService} from "../../../../services/toaster-custom.service";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";

@Component({
  selector: 'app-discount-page',
  templateUrl: './discount-page.component.html',
  styleUrls: ['./discount-page.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'uk'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class DiscountPageComponent implements OnInit {

  myProductId: string | null;
  discountsDatasource: any;
  discounts: Discount[] = [];
  discount: Discount;
  isLoading: boolean = false;
  displayedColumns: string[] = ['offered price', 'starts at', 'ends at', 'delete'];
  discountForm: FormGroup;
  today = new Date();
  minDate: Date = new Date();
  isPast: boolean = false;
  isWrongStart: boolean = false;
  isWrongEnd: boolean = false;
  startTime: string = '';
  endTime: string = '';
  isIncorrectTime: boolean = false;
  newDate: any;
  offeredPriceErrorMessage = ValidationMessages.offeredPrice;
  startAtErrorMessage = ValidationMessages.startAt;
  pastErrorMessage = ValidationMessages.past;
  endsAtErrorMessage = ValidationMessages.endsAt;
  requiredErrorMessage = ValidationMessages.required;
  timeErrorMessage = ValidationMessages.time;
  firstInputTime: any;
  secondInputTime: any;

  constructor(
    private discountService: DiscountsHttpService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toaster: ToasterCustomService
  ) {

  }

  ngOnInit(): void {
    // this.today.setHours(0, 0, 0)
    this.minDate.setDate(this.today.getDate() + 1);
    // // this.minDate.setUTCHours(-3,0,0)
    // console.log(this.minDate)
    this.isLoading = true;
    this.discountForm = this.createDiscountForm();
    this.myProductId = this.route.snapshot.paramMap.get('productId');
    this.getUnexpiredDiscounts(this.myProductId);
  }

  public createDiscountForm(): FormGroup {
    return this.formBuilder.group({
      offeredPrice: offeredPrice(),
      startsAt: startsAt(),
      endsAt: endsAt(),
      timeStart: timeStart(),
      timeEnd: timeEnd()
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


  public fetchStart(event: any) {
    this.firstInputTime = this.discountForm.get('timeStart')?.value.match(/.{1,2}/g).join(':');
  }

  public fetchEnd(event: any) {
    this.secondInputTime = this.discountForm.get('timeEnd')?.value.match(/.{1,2}/g).join(':');
  }

  public submit(discountData: any, formDirective: FormGroupDirective) {
    console.log(discountData)
    const res = /21:00:00/gi;
    const firstString = JSON
      .parse(JSON
        .stringify(this.discountForm.get('startsAt')?.value)
        .replace(res, this.firstInputTime));
    const secondString = JSON
      .parse(JSON
        .stringify(this.discountForm.get('endsAt')?.value)
        .replace(res, this.secondInputTime));
        discountData.startsAt = firstString;
        discountData.endsAt = secondString;
        discountData.offeredPrice = discountData.offeredPrice * 100;
    this.discountService.createDiscount(this.myProductId, discountData).subscribe(
      (response: DiscountModel) => {
        this.getUnexpiredDiscounts(this.myProductId);
        this.toaster.successfulNotification(Labels.discount.successfulCreationDiscount);
      }, err => {
        console.log(err)
        this.toaster.errorNotification(Labels.discount.errorCreationDiscount);
      })
    if (this.discountForm.valid) {
      formDirective.resetForm()
      this.discountForm.reset()
      this.discountForm.markAsUntouched()
    }
  }

  public Check() {
    let a = 1625392800

    for (let i = 0; i <= this.discounts.length; i++) {
    }
  }

}

const offeredPrice = (value?: number) => ([value ?? null, [Validators.required, Validators.min(0)]]);
const startsAt = (value?: Date) => ([value ?? null, [Validators.required]]);
const endsAt = (value?: Date) => ([value ?? null, [Validators.required]]);
const timeStart = (value?: Date) => ([value ?? null, [Validators.required, Validators.minLength(6)]]);
const timeEnd = (value?: Date) => ([value ?? null, [Validators.required, Validators.minLength(6)]]);






