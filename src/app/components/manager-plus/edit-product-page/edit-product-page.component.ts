import {Component, OnInit} from '@angular/core';
import {Products} from "../../../shared/models/api/receive/products";
import {ActivatedRoute} from "@angular/router";
import {RoleService} from "../../../services/role.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductUpdateModel} from "../../../shared/models/api/send/product-update.model";
import Labels from "../../../shared/models/labels/labels.constant";
import {Toaster} from "ngx-toast-notifications";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import {Location} from "@angular/common";
import {ProductsHttpService} from "../../../api-services/products-http.service";
import {Category} from "../../../shared/models/api/receive/category";
import {PublicApiService} from "../../../api-services/public-http.service";

@Component({
  selector: 'app-edit-product-page',
  templateUrl: './edit-product-page.component.html',
  styleUrls: ['./edit-product-page.component.scss']
})
export class EditProductPageComponent implements OnInit {

  categories: Category[];
  product: Products;
  editForm: FormGroup;
  availableQuantity: number;
  categoryName: string;
  selected: any;
  checked: boolean;
  isLoading = false;
  myProductId: string | null;
  isNotPng: boolean;
  selectedFile: File;
  success: boolean = false;
  productNameErrorMessage = ValidationMessages.productName
  quantityErrorMessage = ValidationMessages.quantity
  priceErrorMessage = ValidationMessages.price
  fileErrorMessage = ValidationMessages.file

  constructor(private productService: ProductsHttpService,
              private publicApiService: PublicApiService,
              private route: ActivatedRoute,
              private roleService: RoleService,
              private formBuilder: FormBuilder,
              private toaster: Toaster,
              private location: Location
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getCategories();
    this.editForm = this.pictureForm();
    this.getCategories();
    this.myProductId = this.route.snapshot.paramMap.get('productId');
    this.productService.getProduct(this.myProductId).pipe(finalize(() => {
        this.isLoading = false
      })).subscribe(
      data => {
        this.product = data;
        this.availableQuantity = this.product.inStock - this.product.reserved;
        this.checked = this.product.isActive;
        this.initForm();
        this.getCategories();
        this.isLoading = false;
      }
    );
    this.publicApiService.getCategoryName(this.myProductId).subscribe(
      data => {
        this.categoryName = (data);
      }
    );
  }

  public pictureForm(): FormGroup{
    return this.formBuilder.group({
      file: file()
    })
  }

  public onFileSelected($event: any) {
    this.selectedFile = $event.target.files[0];
    this.isNotPng = (this.selectedFile.type != 'image/png');
  }

  private initForm() {
    this.editForm = this.formBuilder.group({
      productName: new FormControl(this.product.name, [Validators.required, Validators.pattern(productNameRegExp)]),
      description: new FormControl(this.product.description, [Validators.required, Validators.min(1)]),
      inStock: new FormControl(this.product.inStock, [Validators.required, Validators.min(1)]),
      price: new FormControl(this.product.price, [Validators.required, Validators.min(0)]),
      reserved: new FormControl(this.product.reserved, [Validators.required]),
      categoryId: new FormControl(this.product.categoryId, [Validators.required]),
      file: new FormControl(this.product.imageUrl)
    })
  }

  public getCategories(): void {
      this.publicApiService.getListOfCategories().subscribe(
        (response: Category[]) => {
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
    if(this.selectedFile !== undefined){
    this.productService
        .updateProductPicture(this.myProductId, this.selectedFile)
        .subscribe( res => {
          this.success = true;
      });
     }

      this.productService.updateProductInfo(this.myProductId, updateInfo)
        .subscribe(res => {
          this.toaster.open({
            text: Labels.product.successfulUpdatingProduct,
            caption: Labels.caption.success,
            duration: 4000,
            type: 'success'
          });
        }, err => {
          this.toaster.open({
            text: Labels.product.errorUpdatingProduct,
            caption: Labels.caption.error,
            duration: 4000,
            type: 'danger'
          });
        })
    if(this.editForm.valid){
      this.location.go('../product/')
    }
  }
}

const productNameRegExp = "^[^\\d\\s]{2}[\\w\\s]{0,28}$";
const file = (value?: any) => ([value ?? null, [Validators.required]])
