import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Products} from "../shared/models/api/receive/products";
import {ProductUpdateModel} from "../shared/models/api/send/product-update.model";


@Injectable({
  providedIn: 'root'
})

export class ProductsHttpService{
  private apiServerUrl = environment.backURL;

  constructor(private http: HttpClient) {  }

  public getProduct(productId: string | null): Observable<Products>{
    return this.http.get<Products>(`${this.apiServerUrl}/api/v1/public/products/${productId}`);
  }

  public patchActivateDeactivateProduct(productId: string): Observable<Products> {
    return this.http.patch<Products>(`${this.apiServerUrl}/api/v1/manager/products/${productId}/activate-deactivate`, {});
  }

  public updateProductPicture(id: string | null, file: File): Observable<Products> {
    let pictureData: FormData = new FormData();
    pictureData.append('file', file);
    return this.http.put<Products>(`${this.apiServerUrl}/api/v1/manager/products/${id}/edit-picture`, pictureData);
  }

  public updateProductInfo(productId: string | null, productUpdateModel: ProductUpdateModel): Observable<ProductUpdateModel> {
    return this.http.put<ProductUpdateModel>(`${this.apiServerUrl}/api/v1/manager/products/${productId}/edit-info`, productUpdateModel);
  }

}
