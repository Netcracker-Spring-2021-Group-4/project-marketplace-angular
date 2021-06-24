import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyStatus'
})
export class StatusPrettifierPipe implements PipeTransform {

  transform(value: string): string {
    return mapper[value];
  }
}

const mapper : {[key: string]: string}= {
  SUBMITTED: 'Submitted',
  IN_DELIVERY: 'In delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed'
}
