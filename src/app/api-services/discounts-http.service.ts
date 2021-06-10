import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Discount} from "../shared/models/api/receive/discount";
import {DiscountModel} from "../shared/models/api/send/discount-model";

@Injectable({
  providedIn: 'root'
})
export class DiscountsHttpService {
  private apiServerUrl = environment.backURL;

  constructor(private http: HttpClient,
  ) {  }

  public getUnexpiredDiscounts(productId: string | null):Observable<Discount[]>{
    return this.http.get<Discount[]>(`${this.apiServerUrl}/api/v1/manager/products/${productId}/unexpired-discounts`);
  }

  public createDiscount(productId: string | null, discountModel: DiscountModel): Observable<DiscountModel>{
    return this.http.post<DiscountModel>(`${this.apiServerUrl}/api/v1/manager/products/${productId}/discounts`, discountModel)
  }

  public deleteDiscount(discountId: string): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/api/v1/manager/products/discounts/${discountId}`);
  }
  public getActiveDiscount(productId: string | null): Observable<Discount>{
    return this.http.get<Discount>(`${this.apiServerUrl}/api/v1/public/products/${productId}/active-discount`);
  }

}
