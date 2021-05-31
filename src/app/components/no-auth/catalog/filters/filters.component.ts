import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import { Options, LabelType } from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  categories = new FormControl();
  categoryList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];




  constructor() { }

  ngOnInit(): void {
  }

}
