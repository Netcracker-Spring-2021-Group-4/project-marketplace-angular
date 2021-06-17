import {Component, OnInit} from '@angular/core';
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
import {Category_DUBLICAT} from "../../../shared/models/api/receive/category_dublicat";


@Component({
  selector: 'app-edit-product-page',
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.scss']
})
export class EditProductPageComponent implements OnInit {

  categories: Category_DUBLICAT[];
  product: ProductInfo;
  editForm: FormGroup;
  categoryName: string;
  selected: any;
  checked: boolean;
  isLoading = false;
  myProductId: string | null;
  selectedFile: File;
  success: boolean = false;
  productNameErrorMessage = ValidationMessages.productName;
  quantityErrorMessage = ValidationMessages.quantity;
  priceErrorMessage = ValidationMessages.price;
  descriptionErrorMessage = ValidationMessages.required;
  fileExpansionErrorMessage = ValidationMessages.expansion;
  fileWeightErrorMessage = ValidationMessages.weight;
  fileResolutionErrorMessage = ValidationMessages.resolution;
  isHeavier: boolean = false;
  isChange: boolean = false;
  isNotPng: boolean = false;
  isWrongResolution: boolean = false;

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
    this.getCategories();
    this.editForm = this.pictureForm();
    this.myProductId = this.route.snapshot.paramMap.get('productId');
    this.productService.getProduct(this.myProductId).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(
      data => {
        this.product = data;
        this.checked = this.product.isActive;
        this.initForm();
        this.getCategories();
      }
    );
    this.publicApiService.getCategoryName(this.myProductId).subscribe(
      data => {
        this.categoryName = (data);
      }
    );
  }

  public onFileSelected($event: any) {
    let ff = this;
    this.selectedFile = $event.target.files[0];
    if (this.selectedFile) {
      this.isChange = true
    }
    this.isNotPng = (this.selectedFile.type != 'image/png');
    this.isHeavier = (this.selectedFile.size >= 1000000);
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile)
    reader.onload = function ($event): any{
      const img = new Image();
      // @ts-ignore
      img.src = <string>$event.target.result

      img.onload = function () {
       if(img.height != 512 && img.width != 512){
          ff.isWrongResolution = true;
       }
        console.log()
      }
    }


  }

  public pictureForm(): FormGroup {
    return this.formBuilder.group({
      file: file()
    })
  }

  private initForm() {
    this.editForm = this.formBuilder.group({
      productName: new FormControl(this.product.name, [Validators.required, Validators.pattern(productNameRegExp)]),
      description: new FormControl(this.product.description, [Validators.required, Validators.min(2)]),
      inStock: new FormControl(this.product.inStock, [Validators.required, Validators.min(1)]),
      price: new FormControl(this.product.price/100, [Validators.required, Validators.min(0)]),
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
      }
    );
  }

  public patchActivateDeactivateProduct(productId: string) {
    this.checked = !this.checked;
    this.productService.patchActivateDeactivateProduct(productId).subscribe();

  }

  submit(updateInfo: ProductUpdateModel) {
    if(this.editForm.pristine || this.editForm.dirty) {
      updateInfo.price = updateInfo.price * 100;
      this.productService.updateProductInfo(this.myProductId, updateInfo)
        .subscribe(
          res => {
            this.toaster.successfulNotification(Labels.product.successfulUpdatingProduct);
          }, err => {
            this.toaster.errorNotification(Labels.product.errorUpdatingProduct);
          })
    }
    if (this.selectedFile !== undefined) {
      this.productService
        .updateProductPicture(this.myProductId, this.selectedFile)
        .subscribe(res => {
          this.success = true;
        });
    }
     this.editForm.markAsUntouched();
    this.isChange = false;
  }
}

const productNameRegExp = "^[^\\d\\s]{2}[\\w\\s]{0,28}$";
const file = (value?: any) => ([value ?? null, [Validators.required]])
