import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyCategory'
})
export class CategoryPrettifierPipe implements PipeTransform {

  transform(value: string): string {
    return mapper[value];
  }

}

const mapper : {[key: string]: string}= {
  RED_WINE: 'Red wine',
  ROSE_WINE: 'Rose wine',
  WHITE_WINE: 'White wine',
  DESSERT_WINE: 'Dessert wine',
  BLUE_CHEESE: 'Blue cheese',
  HARD_CHEESE: 'Hard cheese',
  PASTA_FILATA_CHEESE: 'Pasta filata cheese',
  PROCESSED_CHEESE: 'Processed cheese',
  SEMI_HARD_CHEESE: 'Semi-hard cheese',
  SEMI_SOFT_CHEESE: 'Semi-soft cheese',
  SOFT_FRESH_CHEESE: 'Soft fresh cheese',
  SOFT_RIPENED_CHEESE: 'Soft ripened cheese'
}
