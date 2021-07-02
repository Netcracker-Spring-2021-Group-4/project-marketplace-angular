import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import Labels from "../../../shared/models/labels/labels.constant";
import {ManagerApiService} from "../../../api-services/manager-http.service";
import {Subscription} from "rxjs";
import {MatSelectChange} from "@angular/material/select";

import {ProductManagerFormService} from "../services/product-manager-form.service";
import {ValidFile} from "../../../shared/components/file-uploader/file-uploader";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {CategoryInfo} from "../../../shared/models/api/receive/category-info";
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-create-product-page',
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.scss']
})


export class CreateProductPageComponent implements OnInit, OnDestroy {
  imgUrl: string | ArrayBuffer | null | undefined
  form: FormGroup
  selectedFile?: File
  categories: CategoryInfo[]
  isHeavier?: boolean = false;
  isWrongResolution?: boolean = false;
  isNotPng?: boolean = false;
  isLoading = false
  selected: number
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
    private titleService: Title
  ) {
    this.titleService.setTitle("Create product")
    this.form = this.productManagerFormService.createProductForm();
  }

  ngOnInit(): void {
    this.getCategories();
  }

  public getCategories(): void {
    this.subscriptions.push(
      this.productManagerFormService.getCategories().subscribe(
        (response: CategoryInfo[]) => {
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

    if (this.isHeavier || this.isNotPng || this.isWrongResolution) {
      this.imgUrl = undefined;
    } else {
      this.imgUrl = validFile.imgUrl;
    }
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
