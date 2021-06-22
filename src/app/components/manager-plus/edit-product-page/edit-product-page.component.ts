import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ProductInfo} from "../../../shared/models/api/receive/productInfo";
import {ActivatedRoute} from "@angular/router";
import {RoleService} from "../../../services/role.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductUpdateModel} from "../../../shared/models/api/send/product-update.model";
import Labels from "../../../shared/models/labels/labels.constant";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize, isEmpty} from "rxjs/operators";
import {ProductsHttpService} from "../../../api-services/products-http.service";
import {PublicApiService} from "../../../api-services/public-http.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {Category_DUBLICAT} from "../../../shared/models/api/receive/category_dublicat";
import {ValidFile} from "../../../shared/components/file-uploader/file-uploader";

@Component({
  selector: 'app-edit-product-page',
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.scss']
})
export class EditProductPageComponent implements OnInit {

  @ViewChild('start') firstImage: ElementRef;
  imgUrl: any;
  selectedFile: File | undefined
  isHeavier?: boolean = false;
  isChange?: boolean = false;
  isNotPng?: boolean = false;
  isWrongResolution?: boolean = false;
  categories: Category_DUBLICAT[];
  product: ProductInfo;
  form: FormGroup;
  categoryName: string;
  selected: any;
  checked: boolean;
  isLoading = false;
  myProductId: string | null;
  success: boolean = false;
  productNameErrorMessage = ValidationMessages.productName;
  quantityErrorMessage = ValidationMessages.quantity;
  priceErrorMessage = ValidationMessages.price;
  fileExpansionErrorMessage = ValidationMessages.expansion;
  fileWeightErrorMessage = ValidationMessages.weight;
  fileResolutionErrorMessage = ValidationMessages.resolution;
  isDisabled: boolean = false;
  doSend: boolean = false;
  isEmpty?: boolean = false;

  constructor(private productService: ProductsHttpService,
              private publicApiService: PublicApiService,
              private route: ActivatedRoute,
              private roleService: RoleService,
              private formBuilder: FormBuilder,
              private toaster: ToasterCustomService,
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.form = this.pictureForm();
    this.myProductId = this.route.snapshot.paramMap.get('productId');
    this.productService.getProduct(this.myProductId).pipe(finalize(() => {
    })).subscribe(
      data => {
        this.product = data;
        this.checked = this.product.isActive;
        this.initForm();
        this.publicApiService.getCategoryName(this.myProductId).subscribe(
          data => {
            this.categoryName = (data);
            this.getCategories();
          });
      });
   }

  public pictureForm(): FormGroup {
    return this.formBuilder.group({
      file: file()
    })
  }

  private initForm() {
    this.form = this.formBuilder.group({
      productName: new FormControl(this.product.name, [Validators.required, Validators.pattern(productNameRegExp)]),
      description: new FormControl(this.product.description),
      inStock: new FormControl(this.product.inStock, [Validators.required, Validators.min(1)]),
      price: new FormControl(this.product.price / 100, [Validators.required, Validators.min(0), Validators.max(23598)]),
      reserved: new FormControl(this.product.reserved, [Validators.min(0)]),
      categoryId: new FormControl(this.product.categoryId, [Validators.required]),
      file: new FormControl(this.product.imageUrl)
    })
  }

  public getCategories(): void {
    this.publicApiService.getListOfCategories().subscribe(
      (response: Category_DUBLICAT[]) => {
        this.categories = response;
        this.selected = this.product.categoryId;
        this.isLoading = false;
      }
    );
  }

  public activateDeactivateProduct(productId: string) {
    this.checked = !this.checked;
    this.productService.activateDeactivateProduct(productId).subscribe(
      () => {
        this.toaster.successfulNotification(Labels.product.successfulActivateProduct)
      }
    );
  }

  public submit(updateInfo: ProductUpdateModel) {
    if (this.doSend) {
      updateInfo.price = updateInfo.price * 100;
      this.productService.updateProductInfo(this.myProductId, updateInfo)
        .subscribe(
          () => {
            this.toaster.successfulNotification(Labels.product.successfulUpdatingProduct);
          }, () => {
            this.toaster.errorNotification(Labels.product.errorUpdatingProduct);
          })
    }
    if (this.selectedFile !== undefined) {
      this.productService
        .updateProductPicture(this.myProductId, this.selectedFile)
        .subscribe(() => {
          this.success = true;
          this.toaster.successfulNotification(Labels.product.successfulUpdatingProductPicture);
          (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = "";
        }, () => {
          this.toaster.errorNotification(Labels.product.errorUpdatingProductPicture);
        })}
    this.form.markAsPristine()
    this.isChange = false;
    this.isDisabled = true;
    this.doSend = false;
  }

  public discardChanges() {
    (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = "";
    this.initForm();
    this.firstImage.nativeElement.src = this.product.imageUrl
  }

  public onFormChange(event: any) {
    this.isDisabled = false
    this.doSend = true;
  }

  getFile(validFile: ValidFile) {
    this.selectedFile = validFile.selectedFile;
    this.isHeavier = validFile.isHeavier;
    this.isChange = validFile.isChange;
    this.isWrongResolution = validFile.isWrongResolution;
    this.isNotPng = validFile.isNotPng;
    this.isEmpty = validFile.isEmpty;
    this.imgUrl = validFile.imgUrl
  }

}

const productNameRegExp = "^[^\\d\\s]{2}[\\w\\s]{0,28}$";
const file = (value?: any) => ([value ?? null, [Validators.required]])
