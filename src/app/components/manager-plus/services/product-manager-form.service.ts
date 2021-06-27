import {
  FormBuilder, FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CategoryInfo} from "../../../shared/models/api/receive/category-info";
@Injectable({
  providedIn: 'root'
})
export class ProductManagerFormService {
  private apiServerUrl =environment.backURL
  constructor(
    private formBuilder: FormBuilder,
    private http:HttpClient
  ) {
  }
  public getCategories():Observable<CategoryInfo[]>{
    return this.http.get<CategoryInfo[]>(`${this.apiServerUrl}/api/v1/public/categories-all`);
  }

  public createProductForm()
    : FormGroup {
    return this.formBuilder.group({
      productName: productName(),
      description: description(),
      price: price(),
      inStock: inStock(),
      categoryId: categoryId(),
      file: file()
    });}


}
const productNameRegExp = "^[^\\d\\s]{2}[\\w\\s]{0,28}$"
const productName = () => ([null, [Validators.required, Validators.pattern(productNameRegExp)]])
const inStock = (value?: number) => ([value ?? null, [Validators.required,  Validators.min(1)]])
const price = (value?: number) => ([value ?? null, [Validators.required, Validators.max(23598),Validators.min(0.05)]])
const categoryId = (value?: number) => ([value ?? null, [Validators.required, Validators.min(0)]])
const description = (value?: string) => ([value ?? null])
const file = (value?: any) => ([value ?? null, [Validators.required]])
