import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CatalogPublicHttpService} from "../../../../api-services/catalog-public-http.service";
import {Product} from "../../../../shared/models/api/receive/product";
import {UserRole} from "../../../../shared/models/enums/role.enum";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @Input() products:Product[]
  @Input() role:UserRole

  @Output() addToCartEvent = new EventEmitter();


  constructor() { }

  ngOnInit(): void {

  }

}
