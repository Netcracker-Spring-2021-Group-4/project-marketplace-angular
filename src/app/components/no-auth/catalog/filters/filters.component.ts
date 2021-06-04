import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray,  FormControl, FormGroup} from "@angular/forms";
import {CatalogPublicHttpService} from "../../../../api-services/catalog-public-http.service";
import { Options, LabelType } from '@angular-slider/ngx-slider';
import {FilterProperties} from "../../../../shared/models/api/receive/filter-props";
import {MatOptionSelectionChange} from "@angular/material/core";


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})


export class FiltersComponent implements OnInit {
  @Input() productCatalogFilter: FormGroup;
  @Input() properties: FilterProperties;

  @Output() searchCriteriaEvent = new EventEmitter<FormGroup>();



  private productService: CatalogPublicHttpService;
  minValue: number ;
  maxValue: number ;
  options: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> $' + value;
        case LabelType.High:
          return '<b>Max price:</b> $' + value;
        default:
          return '$' + value;
      }
    }
  };

  get categoriesFormArray() {
    return this.productCatalogFilter.controls.categories as FormArray;
  }


  search(): void
  {
      const selectedCategoriesIds = this.productCatalogFilter.value.categories
       .map((checked:boolean, i:number) => checked ? this.properties.categories[i].categoryId : null)
       .filter((v: any) => v !== null);

      this.searchCriteriaEvent.emit(this.productCatalogFilter);

  };






  constructor(productsService:CatalogPublicHttpService) {
    this.productService= productsService;
    this.minValue=0;
    this.maxValue=1000;
  }


  ngOnInit(): void {
 }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['properties']) {
      this.properties.categories.forEach(() => this.categoriesFormArray.push(new FormControl(false)));
      this.options.ceil=this.properties.maxPrice;
    }
  }

  onCategorySelect($event: MatOptionSelectionChange, index:number, ) {
    if($event.source.selected)
      (this.categoriesFormArray.controls[index].setValue(true));
    else
      (this.categoriesFormArray.controls[index].setValue(false));

  }





}

