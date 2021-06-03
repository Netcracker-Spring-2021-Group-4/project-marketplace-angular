import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {Product} from "../../../shared/models/api/receive/product";
import {CatalogPublicHttpService} from "../../../api-services/catalog-public-http.service";
import {PageEvent} from "@angular/material/paginator";
import {FilterProperties} from "../../../shared/models/api/receive/filter-props";
import {ProductFilterModel} from "../../../shared/models/api/send/product-filter.model";
import {finalize} from "rxjs/operators";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  formGroup: FormGroup;
  selectedPage:number
  length:number
  products:Product[]=[]
  filterProps:FilterProperties
  private isLoading: boolean;

  constructor(private productService:CatalogPublicHttpService )
  {
    this.formGroup = productService.catalogSearchForm() ;
    this.selectedPage = 0;
  }
//rxJs
  ngOnInit(): void {
    let productPage = this.productService.getProductsPage(0, 9);
    let filterProperties = this.productService.getFilterProperties();

    this.isLoading = true;
    forkJoin([productPage, filterProperties])
      .pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(results => {

        console.log("here")
      this.products = results[0].content;
      this.length = results[0].totalItems
      this.filterProps = results[1]

    });
  }



  handlePageChange($event: PageEvent) {
    this.productService.getProductsPage($event.pageIndex,$event.pageSize)
       .subscribe(response => {
         this.products = response.content;
         this.length = response.totalItems;
         this.selectedPage = $event.pageIndex;
       });

  }

  setSearchCriteria() {
    let searchCriteria: ProductFilterModel = {}

    if (this.formGroup.get('query')?.value)
      searchCriteria.nameQuery = this.formGroup.get('query')?.value
    if (this.formGroup.get('price')?.value) {
      searchCriteria.minPrice = this.formGroup.get('price')?.value[0]
      searchCriteria.maxPrice = this.formGroup.get('price')?.value[1]
    }
    if(this.formGroup.get('categories')?.value)
      searchCriteria.categories = this.formGroup.get('sort')?.value

    searchCriteria.sortBy = this.formGroup.get('sortBy')?.value


    this.updatePage(searchCriteria)
  }


  updatePage(searchCriteria: ProductFilterModel){
    this.selectedPage=0
    this.productService.postProductsPage(searchCriteria,this.selectedPage,9)
      .subscribe(response => {
        this.products = response.content;
        this.length = response.totalItems;
        this.selectedPage = 0;
      });
  }
}

