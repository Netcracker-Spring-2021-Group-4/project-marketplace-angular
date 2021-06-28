import { Injectable } from '@angular/core';
import {Product} from "../shared/models/api/receive/product";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {ContentPage} from "../shared/models/api/receive/content-page";
import {FilterProperties} from '../shared/models/api/receive/filter-props';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductFilterModel} from "../shared/models/api/send/product-filter.model";
import {SortOptionEnum} from "../shared/models/enums/sort-option.enum";

@Injectable({
  providedIn: 'root'
})
export class CatalogPublicHttpService {

  private URL: string;
  public catalogSearchForm() :FormGroup {
    return this.formBuilder.group({
      price: new FormControl(),
      query: new FormControl(""),
      categories: new FormArray([]),
      sortBy: new FormControl()
    });
  }

  constructor(private http:HttpClient,
  private formBuilder: FormBuilder
) {
    this.URL = `${environment.backURL}`
  }


  postProductsPage(filters:ProductFilterModel, page:number, size:number):Observable<ContentPage<Product>> {
    let params = new HttpParams().set('page', page).set('size',size);
    return this.http.post<ContentPage<Product>>(`${this.URL}/api/v1/public/product-page`, filters, {params: params});
  }

  getFilterProperties():Observable<FilterProperties> {
    return this.http.get<FilterProperties>(`${this.URL}/api/v1/public/filter-info`)
  }
}
