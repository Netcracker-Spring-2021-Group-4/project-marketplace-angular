import { Component, OnInit } from '@angular/core';

interface SortOptions {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  options: SortOptions[] = [
    {value: 'price-descending', viewValue: 'Price Descending'},
    {value: 'price-ascending', viewValue: 'Price Ascending'},
    {value: 'name', viewValue: 'Name'},
    {value: 'newest', viewValue: 'Newest'}

  ];

  constructor() { }

  ngOnInit(): void {
  }

}
