import {Component, Input, OnInit} from '@angular/core';
import {CatalogPublicHttpService} from "../../../../api-services/catalog-public-http.service";
import {Product} from "../../../../shared/models/api/receive/product";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @Input() products:Product[]

  constructor() { }

  ngOnInit(): void {

  }

}
