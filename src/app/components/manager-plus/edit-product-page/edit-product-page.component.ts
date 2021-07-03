import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductInfo} from "../../../shared/models/api/receive/productInfo";
import {ActivatedRoute} from "@angular/router";
import {RoleService} from "../../../services/role.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductUpdateModel} from "../../../shared/models/api/send/product-update.model";
import Labels from "../../../shared/models/labels/labels.constant";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import {ProductsHttpService} from "../../../api-services/products-http.service";
import {PublicApiService} from "../../../api-services/public-http.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {ValidFile} from "../../../shared/components/file-uploader/file-uploader";
import {CategoryInfo} from "../../../shared/models/api/receive/category-info";
import {Subscription} from "rxjs";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-edit-product-page',
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.scss']
})
export class EditProductPageComponent implements OnInit, OnDestroy {

  imgUrl: string | undefined | ArrayBuffer | null;
  selectedFile: File | undefined;
  isHeavier?: boolean = false;
  isChange?: boolean = false;
  isNotPng?: boolean = false;
  isWrongResolution?: boolean = false;
  isDisabled?: boolean = false;
  doSend: boolean = false;
  categories: CategoryInfo[];
  product: ProductInfo;
  form: FormGroup;
  categoryName: string;
  selected: number;
  checked: boolean;
  isLoading = false;
  requiredErrorMessage = ValidationMessages.required;
  productNameErrorMessage = ValidationMessages.productName;
  quantityErrorMessage = ValidationMessages.quantity;
  priceErrorMessage = ValidationMessages.price;
  fileExpansionErrorMessage = ValidationMessages.expansion;
  fileWeightErrorMessage = ValidationMessages.weight;
  fileResolutionErrorMessage = ValidationMessages.resolution;
  minPriceErrorMessage = ValidationMessages.minPrice
  maxPriceErrorMessage = ValidationMessages.maxPrice
  private subscriptions: Subscription[] = [];

  constructor(private productService: ProductsHttpService,
              private publicApiService: PublicApiService,
              private route: ActivatedRoute,
              private roleService: RoleService,
              private formBuilder: FormBuilder,
              private toaster: ToasterCustomService,
              private titleService: Title
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscriptions) => subscriptions.unsubscribe()
    );
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.isLoading = true;
    const productId = this.route.snapshot.paramMap.get('productId');
    if(productId){
      this.subscriptions.push(this.productService.getProduct(productId).pipe(finalize(() => {
      })).subscribe(
        data => {
          this.product = data;
          this.titleService.setTitle(`Edit ${this.product.name}'s info`)
          this.checked = this.product.isActive;
          this.initForm();
          this.publicApiService.getCategoryName(productId).subscribe(
            data => {
              this.categoryName = (data);
              this.getCategories();
              this.isLoading = false;
            });
        }));
    }
  }

   private initForm() {
    this.form = this.formBuilder.group({
      productName: new FormControl(this.product.name, [
          Validators.required,
          Validators.pattern(productNameRegExp)
      ]),
      description: new FormControl(this.product.description),
      inStock: new FormControl(this.product.inStock, [
        Validators.required,
        Validators.min(1)
      ]),
      price: new FormControl(this.product.price / 100, [
        Validators.required,
        Validators.min(0.05),
        Validators.max(23598)
      ]),
      reserved: new FormControl(this.product.reserved, [Validators.min(0)]),
      categoryId: new FormControl(this.product.categoryId, [Validators.required]),
      file: new FormControl(this.product.imageUrl)
    })
     this.form.controls['file'].setValue('');
  }

  public getCategories(): void {
    this.subscriptions.push(this.publicApiService.getListOfCategories().subscribe(
      (response: CategoryInfo[]) => {
        this.categories = response;
        this.selected = this.product.categoryId;
        this.isLoading = false;
      }
    ));
  }

  public activateDeactivateProduct(productId: string) {
    this.checked = !this.checked;
    this.subscriptions.push(this.productService.activateDeactivateProduct(productId).subscribe(
      () => {
        this.product.reserved = 0;
        this.toaster.successfulNotification(Labels.product.successfulActivateProduct);
      }
    ));
  }

  public submit(updateInfo: ProductUpdateModel) {
    if (this.doSend) {
      updateInfo.price = updateInfo.price * 100;
      this.subscriptions.push(this.productService.updateProductInfo(this.product.productId, updateInfo)
        .subscribe(
          () => {
            this.toaster.successfulNotification(Labels.product.successfulUpdatingProduct);
          }, () => {
            this.toaster.errorNotification(Labels.product.errorUpdatingProduct);
          }));
    }
    if (this.selectedFile) {
      this.subscriptions.push(this.productService
        .updateProductPicture(this.product.productId, this.selectedFile)
        .subscribe(() => {
          this.toaster.successfulNotification(Labels.product.successfulUpdatingProductPicture);
          (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = "";
        }, () => {
          this.toaster.errorNotification(Labels.product.errorUpdatingProductPicture);
        }))}
    this.selectedFile = undefined;
    this.form.markAsPristine();
    this.isChange = false;
    this.isDisabled = true;
    this.doSend = false;
  }

  public discardChanges() {
    (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = "";
    this.isChange = false;
    this.isHeavier = false;
    this.isWrongResolution = false;
    this.isNotPng = false;
    this.selectedFile = undefined;
    this.imgUrl = undefined;
    this.initForm();
  }

  public onFormChange(event: any) {
    this.isDisabled = false;
    this.doSend = true;
  }

  public getFile(validFile: ValidFile) {
    this.selectedFile = validFile.selectedFile;
    this.isHeavier = validFile.isHeavier;
    this.isChange = validFile.isChange;
    this.isWrongResolution = validFile.isWrongResolution;
    this.isNotPng = validFile.isNotPng;
    if (this.isHeavier || this.isNotPng || this.isWrongResolution){
      this.imgUrl = undefined;
    }else{
      this.imgUrl = validFile.imgUrl;
    }
    this.isDisabled = validFile.isDisabled;
  }

}

const productNameRegExp = "^[^\\d\\s]{2}[\\w\\s]{0,28}$";
const file = (value?: any) => ([value ?? null, [Validators.required]]);
