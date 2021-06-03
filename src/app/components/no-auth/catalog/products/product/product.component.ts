import { Component, OnInit, Input } from '@angular/core';
import {Product} from "../../../../../shared/models/api/receive/product";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() productItem:Product
  constructor() { }

  ngOnInit(): void {
  }

}
