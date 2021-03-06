import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Product} from "../../../shared/models/api/receive/product";
import {CatalogPublicHttpService} from "../../../api-services/catalog-public-http.service";
import {PageEvent} from "@angular/material/paginator";
import {FilterProperties} from "../../../shared/models/api/receive/filter-props";
import {ProductFilterModel} from "../../../shared/models/api/send/product-filter.model";
import {finalize} from "rxjs/operators";
import {forkJoin, Subscription} from "rxjs";
import {RoleService} from "../../../services/role.service";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  formGroup: FormGroup;
  length: number
  products: Product[]
  filterProps: FilterProperties
  role: UserRole
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;

  private subscription$: Subscription;


  constructor(
    private productService: CatalogPublicHttpService,
    private roleService: RoleService,
    private titleService: Title
  ) {
    this.titleService.setTitle("Catalog")
    this.formGroup = productService.catalogSearchForm();
    this.pageSize = 9;
    this.filterProps = new FilterProperties({categories: []});
    this.roleService.currentRole$.subscribe(response => {
      this.role = response
    });
  }


  ngOnInit(): void {
    let productPage = this.productService.postProductsPage(this.setSearchCriteria(), 0, this.pageSize);
    let filterProperties = this.productService.getFilterProperties();

    this.isLoading = true;
    this.subscription$ = forkJoin([productPage, filterProperties])
      .pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(results => {
        this.products = results[0].content
        this.length = results[0].totalItems
        this.filterProps = results[1]

      }, error => {
        console.log({error});
      });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();

  }


  handlePageChange($event: PageEvent) {
    let searchCriteria = this.setSearchCriteria();
    this.subscription$.unsubscribe()
    this.subscription$= this.productService.postProductsPage(searchCriteria, $event.pageIndex, $event.pageSize)
      .subscribe(response => {
        this.products = response.content;
        this.length = response.totalItems;
        this.pageIndex = $event.pageIndex;
      });
  }

  updatePage() {
    let searchCriteria = this.setSearchCriteria();
    this.subscription$.unsubscribe()
    this.subscription$ = (this.productService.postProductsPage(searchCriteria, 0, this.pageSize)
      .subscribe(response => {
        this.products = response.content;
        this.length = response.totalItems;
        this.pageIndex = 0;
      }))

  }

  private setSearchCriteria(): ProductFilterModel {
    let searchCriteria: ProductFilterModel = {}

    if (this.formGroup.get('query')?.value)
      searchCriteria.nameQuery = this.formGroup.get('query')?.value
    if (this.formGroup.get('price')?.value) {
      searchCriteria.minPrice = this.formGroup.get('price')?.value[0] * 100
      searchCriteria.maxPrice = this.formGroup.get('price')?.value[1] * 100
    }

    if (this.formGroup.get('categories')?.value) {
      searchCriteria.categoryIds = this.formGroup.value.categories
        .map((checked: boolean, i: number) => checked ? this.filterProps.categories[i].categoryId : null)
        .filter((v: any) => v !== null);
      if (searchCriteria.categoryIds?.length == 0)
        searchCriteria.categoryIds = this.filterProps.categories.map(category => category.categoryId);
    }
    if (this.formGroup.get('sortBy')?.value)
      searchCriteria.sortOption = this.formGroup.get('sortBy')?.value

    return searchCriteria;
  }
}

