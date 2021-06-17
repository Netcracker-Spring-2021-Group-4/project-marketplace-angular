import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges, ViewChild,
} from '@angular/core';
import {FormArray,  FormControl, FormGroup} from "@angular/forms";
import { LabelType } from '@angular-slider/ngx-slider';
import {FilterProperties} from "../../../../shared/models/api/receive/filter-props";
import {MatOption, MatOptionSelectionChange} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})


export class FiltersComponent implements OnInit {

  @ViewChild('matRef') matRef: MatSelect;


  @Input() productCatalogFilter: FormGroup;
  @Input() properties: FilterProperties;
  @Output() searchCriteriaEvent = new EventEmitter<FormGroup>();



  minValue: number;
  maxValue: number;

  get categoriesFormArray() {
    return this.productCatalogFilter.controls.categories as FormArray;
  }


  search(): void {
    this.searchCriteriaEvent.emit(this.productCatalogFilter);

  };


  constructor() {

  }


  clearAll(): void{
    this.matRef.options.forEach((data: MatOption) => data.deselect());
    this.productCatalogFilter.reset()
    this.productCatalogFilter.controls.price.setValue([0, this.properties.maxPrice]);
    this.searchCriteriaEvent.emit(this.productCatalogFilter);
  }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {

    if (changes['properties']) {
      this.properties.categories.forEach(() => this.categoriesFormArray.push(new FormControl(false)));
    }
    if(this.properties.maxPrice>0)
      this.maxValue=this.properties.maxPrice/100
  }


  onCategorySelect($event: MatOptionSelectionChange, index: number,) {
    if ($event.source.selected)
      (this.categoriesFormArray.controls[index].setValue(true));
    else
      (this.categoriesFormArray.controls[index].setValue(false));

  }


  sliderOptions() {
    return {
      floor: 0,
      ceil: (this.properties.maxPrice)/100,

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
  }

}
