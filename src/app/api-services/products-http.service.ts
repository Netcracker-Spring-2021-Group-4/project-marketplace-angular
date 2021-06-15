import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ProductInfo} from "../shared/models/api/receive/productInfo";
import {ProductUpdateModel} from "../shared/models/api/send/product-update.model";


@Injectable({
  providedIn: 'root'
})

export class ProductsHttpService{
  private apiServerUrl = environment.backURL;

  constructor(private http: HttpClient) {  }

  public getProduct(productId: string | null): Observable<ProductInfo>{
    return this.http.get<ProductInfo>(`${this.apiServerUrl}/api/v1/public/products/${productId}`);
  }

  public patchActivateDeactivateProduct(productId: string): Observable<ProductInfo> {
    return this.http.patch<ProductInfo>(`${this.apiServerUrl}/api/v1/manager/products/${productId}/activate-deactivate`, {});
  }

  public updateProductPicture(id: string | null, file: File): Observable<ProductInfo> {
    let pictureData: FormData = new FormData();
    pictureData.append('file', file);
    return this.http.put<ProductInfo>(`${this.apiServerUrl}/api/v1/manager/products/${id}/edit-picture`, pictureData);
  }

  public updateProductInfo(productId: string | null, productUpdateModel: ProductUpdateModel): Observable<ProductUpdateModel> {

    return this.http.put<ProductUpdateModel>(`${this.apiServerUrl}/api/v1/manager/products/${productId}/edit-info`, productUpdateModel);
    console.log(productUpdateModel)
  }

}
