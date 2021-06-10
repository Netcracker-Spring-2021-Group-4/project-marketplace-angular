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
import {Category} from "../../../shared/models/api/receive/category";
import {ProductManagerFormService} from "../services/product-manager-form.service";

@Component({
  selector: 'app-create-product-page',
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.scss']
})
export class CreateProductPageComponent implements OnInit,OnDestroy {

  form: FormGroup
  selectedFile: File
  categories: Category[]
  isLoading = false
  currentValue:any
  selected2:any
  isNotPng: boolean
  isHeavier:boolean
  private subscriptions: Subscription[] = []

  productNameErrorMessage =ValidationMessages.productName
  quantityErrorMessage = ValidationMessages.quantity
  priceErrorMessage = ValidationMessages.price
  fileErrorMessage = ValidationMessages.file

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
        (response:Category[])=>{
          this.categories=response;
          this.selected2=this.categories[1].categoryId
        },
        (error:HttpErrorResponse)=>{
          console.log(error.message)
        }
      ));
  }

  onFileSelected($event:any) {
    this.selectedFile = $event.target.files[0];
    this.isNotPng=(this.selectedFile.type != 'image/png');
    this.isHeavier = (this.selectedFile.size >= 1000000)
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
          text: Labels.product.errorCreationProduct,
          caption: Labels.caption.error,
          duration: 4000,
          type: 'danger'
        });
      })
    if(this.form.valid) {
      this.form.reset();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscriptions)=>subscriptions.unsubscribe()
    );
    this.subscriptions=[];
  }
}
