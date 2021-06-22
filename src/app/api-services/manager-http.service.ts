import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {AddProductCreditionals} from "../shared/models/api/send/add-product-creditionals";

@Injectable({
  providedIn: 'root'
})
export class ManagerApiService {

  private URL: string;
  private PUBLIC_MANAGER_URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.PUBLIC_MANAGER_URL = `${this.URL}/api/v1/manager`
  }


  createProduct(file:File, addProductCreds: AddProductCreditionals): Observable<any> {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('product',new Blob([JSON.stringify({
      productName: addProductCreds.productName,
      description: addProductCreds.description,
      price: addProductCreds.price,
      inStock: addProductCreds.inStock,
      categoryId: addProductCreds.categoryId,
    })],{
      type: "application/json"
    }));

    return this.httpClient.post(`${this.PUBLIC_MANAGER_URL}/add-product`,formdata)
  }
}
