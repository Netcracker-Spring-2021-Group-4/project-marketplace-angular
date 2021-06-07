import { Component, OnInit, Input } from '@angular/core';
import {Product} from "../../../../../shared/models/api/receive/product";
import {UserRole} from "../../../../../shared/models/enums/role.enum";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() role: UserRole
  @Input() productItem: Product

  constructor() {

  }

  ngOnInit(): void {
  }
}
