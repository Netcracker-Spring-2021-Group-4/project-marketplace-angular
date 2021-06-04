import {
  FormBuilder, FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {Categories} from "../../../shared/models/api/receive/categories";
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
  public getCategories():Observable<Categories[]>{
    return this.http.get<Categories[]>(`${this.apiServerUrl}/api/v1/public/categories`);
  }

  public createProductForm()
    : FormGroup {
    return this.formBuilder.group({
      productName: productName(),
      description: description(),
      price: price(),
      inStock: inStock(),
      reserved: reserved(),
      categoryId: categoryId(),
      file: file()
    });}


}
const productNameRegExp = "^\p{L}{2}[\\p{L}\\s\\d]{0,28}$"
const productName = () => ([null, [Validators.required, Validators.pattern(productNameRegExp)]])
// const productName = (value?: string) => ([value ?? null, [Validators.required,Validators.minLength(2), Validators.maxLength(30)]])
const inStock = (value?: number) => ([value ?? null, [Validators.required, Validators.min(1)]])
const reserved = (value?: number) => ([value ?? null, [Validators.required, Validators.min(1)]])
const price = (value?: number) => ([value ?? null, [Validators.required, Validators.min(0)]])
const categoryId = (value?: number) => ([value ?? null, [Validators.required, Validators.min(0)]])
const description = () => ([null, [Validators.required]])
const file = (value?: any) => ([value ?? null, [Validators.required]])



