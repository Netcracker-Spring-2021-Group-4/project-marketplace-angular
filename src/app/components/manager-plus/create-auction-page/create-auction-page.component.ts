import {Component, OnInit} from '@angular/core';
import {addTimeToDate, AuctionFormService} from "./auction-form.service";
import {FormGroup} from "@angular/forms";
import {AuthStoreApiService} from "../../../api-services/auth-store-http.service";
import {ManagerPlusApiService} from "../../../api-services/mgr-plus-http.service";
import {finalize, first} from "rxjs/operators";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {AuctionType} from "../../../shared/models/api/receive/auction-type.model";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import Labels from "../../../shared/models/labels/labels.constant";
import {Router} from "@angular/router";
import {Route} from "../../../shared/models/enums/route.enum";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-create-auction-page',
  templateUrl: './create-auction-page.component.html',
  styleUrls: ['./create-auction-page.component.scss']
})
export class CreateAuctionPageComponent implements OnInit {
  form: FormGroup;
  auctionTypesList: Array<AuctionType>
  isLoading: boolean;
  minDate = new Date();

  priceErrorMessage = ValidationMessages.priceAuction
  quantityErrorMessage = ValidationMessages.quantityAuction
  idErrorMessage = ValidationMessages.id
  timeToBidErrorMessage = ValidationMessages.timeToBid
  dateTimeInPastErrorMessage = ValidationMessages.dateTimeInPast;
  minRiseErrorMessage = ValidationMessages.minRise;
  loweringStepErrorMessage = ValidationMessages.loweringStep
  stepPeriodErrorMessage = ValidationMessages.stepPeriod
  numStepsErrorMessage = ValidationMessages.numSteps

  constructor(
    private auctionFormService: AuctionFormService,
    private authStoreApiService: AuthStoreApiService,
    private managerPlusApiService: ManagerPlusApiService,
    private router: Router,
    private toaster: ToasterCustomService,
    private titleService: Title
  ) {
    this.titleService.setTitle("Create auction")
    this.form = this.auctionFormService.auctionCreateForm();
  }

  ngOnInit(): void {
    this.isLoading = true
    this.authStoreApiService
      .getAuctionTypes()
      .pipe(
        finalize(() => this.isLoading = false),
        first()
      )
      .subscribe(res => {
        this.auctionTypesList = res;
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })
  }

  changeTypeOfAuction($event: any) {
    const typeId = $event.value
    const type = this.auctionTypesList.find(t => t.typeId === typeId)!
    if (this.form.get('jsonDetails')) {
      this.form.removeControl('jsonDetails')
    }
    this.auctionFormService.addJsonDetails(this.form, type.name)
  }

  get isTypeSelected(): boolean {
    return this.form.get('typeId')!.value
  }

  get isAscendingTypeSelected(): boolean {
    const typeId = this.form.get('typeId')!.value
    return this.auctionTypesList.find(t => t.typeId === typeId)!.name === 'ASCENDING'
  }

  back() {
    this.router.navigate([Route.CATALOG])
  }

  submit() {
    const result = this.form.value
    result.startsAt = addTimeToDate(result.startsAtDate, result.startsAtTime)
    this.changeCurrencyToCents(result)
    this.isLoading = true
    this.managerPlusApiService.createAuction(result)
      .pipe(
        finalize(() => {
          this.isLoading = false
          this.form = this.auctionFormService.auctionCreateForm();
        }),
        first()
      )
      .subscribe(_ => {
        this.toaster.successfulNotification(Labels.auction.successfulCreationAuction)
      }, err => {
        const text = err?.error?.message ??
          'Cannot create that auction with such parameters. Please check the filled fields'
        this.toaster.errorNotification(text)
      })
  }

  private changeCurrencyToCents(obj: any) {
    obj.startPrice = CreateAuctionPageComponent.fromDollarsToCents(obj.startPriceDollars)
    if (obj.jsonDetails.hasOwnProperty('loweringStepDollars'))
      obj.jsonDetails.loweringStep = CreateAuctionPageComponent.fromDollarsToCents(obj.jsonDetails.loweringStepDollars)
    if (obj.jsonDetails.hasOwnProperty('minRiseDollars'))
      obj.jsonDetails.minRise = CreateAuctionPageComponent.fromDollarsToCents(obj.jsonDetails.minRiseDollars)
  }

  private static fromDollarsToCents(num: number): number {
    return Math.trunc(num * 100)
  }
}
