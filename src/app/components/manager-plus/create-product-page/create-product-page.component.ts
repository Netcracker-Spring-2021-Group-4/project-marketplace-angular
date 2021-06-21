import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {Toaster} from "ngx-toast-notifications";
import {finalize} from "rxjs/operators";
import Labels from "../../../shared/models/labels/labels.constant";
import {ManagerApiService} from "../../../api-services/manager-http.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import {MatSelectChange} from "@angular/material/select";
import {Category_DUBLICAT} from "../../../shared/models/api/receive/category_dublicat";
import {ProductManagerFormService} from "../services/product-manager-form.service";
import {ValidFile} from "../../../shared/components/file-uploader/file-uploader";

@Component({
  selector: 'app-create-product-page',
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.scss']
})
export class CreateProductPageComponent implements OnInit,OnDestroy {

  form: FormGroup
  selectedFile: File
  categories: Category_DUBLICAT[]
  isLoading = false
  currentValue:any
  selected2:any
  isNotPng: boolean
  isHeavier:boolean
  isWrongResolution: boolean;
  fileExpansionErrorMessage = ValidationMessages.expansion;
  fileWeightErrorMessage = ValidationMessages.weight;
  fileResolutionErrorMessage = ValidationMessages.resolution;
  private subscriptions: Subscription[] = []
  productNameErrorMessage =ValidationMessages.productName
  quantityErrorMessage = ValidationMessages.quantity
  priceErrorMessage = ValidationMessages.price



  constructor(
    private productManagerFormService: ProductManagerFormService,
    private managerApiService: ManagerApiService,
    private toaster: Toaster,
  ) {
    this.form = this.productManagerFormService.createProductForm();
  }

  ngOnInit(): void {
    this.getCategories();
  }

  OnInput(event: MatSelectChange): void {
    this.currentValue = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  public getCategories(): void{
    this.subscriptions.push(
      this.productManagerFormService.getCategories().subscribe(
        (response:Category_DUBLICAT[])=>{
          this.categories=response;
          this.selected2=this.categories[1].categoryId
        },
        (error:HttpErrorResponse)=>{
          console.log(error.message)
        }
      ));
  }

  submit() {
    this.isLoading = true;
    this.form.patchValue({price: this.form.get('price')?.value * 100})
    const result = this.form.value
    this.managerApiService.createProduct(this.selectedFile,result)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe( res => {
        this.toaster.open({
          text: Labels.product.successfulCreationProduct,
          caption: Labels.caption.success,
          duration: 4000,
          type: 'success'
        });
      }, err => {
        this.toaster.open({
          text: err.error.message,
          caption: Labels.caption.error,
          duration: 4000,
          type: 'danger'
        });
      })

    this.form.reset();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscriptions)=>subscriptions.unsubscribe()
    );
    this.subscriptions=[];
  }

  getFile(validFile: ValidFile) {
    this.selectedFile = validFile.selectedFile;
    this.isHeavier = validFile.isHeavier;
    this.isWrongResolution = validFile.isWrongResolution;
    this.isNotPng = validFile.isNotPng;
  }
}
