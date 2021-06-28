import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-edit-product-page',
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.scss']
})
export class EditProductPageComponent implements OnInit {

  @ViewChild('start') firstImage: ElementRef;
  imgUrl: string | undefined;
  selectedFile: File | undefined
  isHeavier?: boolean = false;
  isChange?: boolean = false;
  isNotPng?: boolean = false;
  isWrongResolution?: boolean = false;
  isDisabled: boolean = false;
  doSend: boolean = false;
  categories: CategoryInfo[];
  product: ProductInfo;
  form: FormGroup;
  categoryName: string;
  selected: number;
  checked: boolean;
  isLoading = false;
  productNameErrorMessage = ValidationMessages.productName;
  quantityErrorMessage = ValidationMessages.quantity;
  priceErrorMessage = ValidationMessages.price;
  fileExpansionErrorMessage = ValidationMessages.expansion;
  fileWeightErrorMessage = ValidationMessages.weight;
  fileResolutionErrorMessage = ValidationMessages.resolution;


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
    const productId = this.route.snapshot.paramMap.get('productId');
    if(productId){
      this.productService.getProduct(productId).pipe(finalize(() => {
      })).subscribe(
        data => {
          this.product = data;
          this.checked = this.product.isActive;
          this.initForm();
          this.publicApiService.getCategoryName(productId).subscribe(
            data => {
              this.categoryName = (data);
              this.getCategories();
              this.isLoading = false;
            });
        });
    }
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
      price: new FormControl(this.product.price / 100, [Validators.required, Validators.min(0.05), Validators.max(23598)]),
      reserved: new FormControl(this.product.reserved, [Validators.min(0)]),
      categoryId: new FormControl(this.product.categoryId, [Validators.required]),
      file: new FormControl(this.product.imageUrl)
    })
  }

  public getCategories(): void {
    this.publicApiService.getListOfCategories().subscribe(
      (response: CategoryInfo[]) => {
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
        this.product.reserved = 0;
        this.toaster.successfulNotification(Labels.product.successfulActivateProduct)
      }
    );
  }

  public submit(updateInfo: ProductUpdateModel) {
    if (this.doSend) {
      updateInfo.price = updateInfo.price * 100;
      this.productService.updateProductInfo(this.product.productId, updateInfo)
        .subscribe(
          () => {
            this.toaster.successfulNotification(Labels.product.successfulUpdatingProduct);
          }, () => {
            this.toaster.errorNotification(Labels.product.errorUpdatingProduct);
          })
    }
    if (this.selectedFile ) {
      this.productService
        .updateProductPicture(this.product.productId, this.selectedFile)
        .subscribe(() => {
          this.toaster.successfulNotification(Labels.product.successfulUpdatingProductPicture);
          (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = "";
        }, () => {
          this.toaster.errorNotification(Labels.product.errorUpdatingProductPicture);
        })}
    this.selectedFile = undefined;
    this.form.markAsPristine()
    this.isChange = false;
    this.isDisabled = true;
    this.doSend = false;
  }

  public discardChanges() {
    (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = "";
    this.isChange = false;
    this.isHeavier = false;
    this.isWrongResolution = false
    this.isNotPng = false
    this.selectedFile = undefined
    this.imgUrl = undefined;
    this.initForm();
    this.firstImage.nativeElement.src = this.product.imageUrl
  }

  public onFormChange(event: any) {
    this.isDisabled = false
    this.doSend = true;
  }

  public getFile(validFile: ValidFile) {
    this.selectedFile = validFile.selectedFile;
    this.isHeavier = validFile.isHeavier;
    this.isChange = validFile.isChange;
    this.isWrongResolution = validFile.isWrongResolution;
    this.isNotPng = validFile.isNotPng;
    this.imgUrl = validFile.imgUrl;
    this.isDisabled = validFile.isDisabled;
  }

}

const productNameRegExp = "^[^\\d\\s]{2}[\\w\\s]{0,28}$";
const file = (value?: any) => ([value ?? null, [Validators.required]])
