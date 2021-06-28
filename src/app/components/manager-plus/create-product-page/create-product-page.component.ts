import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import Labels from "../../../shared/models/labels/labels.constant";
import {ManagerApiService} from "../../../api-services/manager-http.service";
import {Subscription} from "rxjs";
import {MatSelectChange} from "@angular/material/select";
import {Category_DUBLICAT} from "../../../shared/models/api/receive/category_dublicat";
import {ProductManagerFormService} from "../services/product-manager-form.service";
import {ValidFile} from "../../../shared/components/file-uploader/file-uploader";
import {ToasterCustomService} from "../../../services/toaster-custom.service";

@Component({
  selector: 'app-create-product-page',
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.scss']
})
export class CreateProductPageComponent implements OnInit, OnDestroy {
  imgUrl: any;
  selectedFile?: File | undefined
  isNotPng?: boolean = false
  isHeavier?: boolean = false
  isWrongResolution?: boolean = false;
  categories: Category_DUBLICAT[]
  form: FormGroup
  selected: number
  isLoading = false
  currentValue: any
  fileExpansionErrorMessage = ValidationMessages.expansion;
  fileWeightErrorMessage = ValidationMessages.weight;
  fileResolutionErrorMessage = ValidationMessages.resolution;
  productNameErrorMessage = ValidationMessages.productName
  quantityErrorMessage = ValidationMessages.quantity
  priceErrorMessage = ValidationMessages.price
  private subscriptions: Subscription[] = []

  constructor(
    private productManagerFormService: ProductManagerFormService,
    private managerApiService: ManagerApiService,
    private toaster: ToasterCustomService,
  ) {
    this.form = this.productManagerFormService.createProductForm();
  }

  ngOnInit(): void {
    this.getCategories();
  }

  onInput(event: MatSelectChange): void {
    this.currentValue = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  public getCategories(): void {
    this.subscriptions.push(
      this.productManagerFormService.getCategories().subscribe(
        (response: Category_DUBLICAT[]) => {
          this.categories = response;
          this.selected = this.categories[1].categoryId
        }
      )
    );
  }

  submit() {
    this.isLoading = true;
    this.form.patchValue({price: this.form.get('price')?.value * 100})
    const result = this.form.value
    if (this.selectedFile) {
      this.managerApiService.createProduct(this.selectedFile, result)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe(res => {
          this.toaster.successfulNotification(Labels.product.successfulCreationProduct);
        }, err => {
          this.toaster.errorNotification(err.error.message);
        })
    }
    this.imgUrl = undefined;
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscriptions) => subscriptions.unsubscribe()
    );
    this.subscriptions = [];
  }

  getFile(validFile: ValidFile) {
    this.selectedFile = validFile.selectedFile;
    this.isHeavier = validFile.isHeavier;
    this.isWrongResolution = validFile.isWrongResolution;
    this.isNotPng = validFile.isNotPng;
    this.imgUrl = validFile.imgUrl
  }

  resetImg() {
    (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = "";
    this.imgUrl = undefined;
    this.selectedFile = undefined;
    this.isHeavier = false;
    this.isWrongResolution = false;
    this.isNotPng = false;
  }
}
