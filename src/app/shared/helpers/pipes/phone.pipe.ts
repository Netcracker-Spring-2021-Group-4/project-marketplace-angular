import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: string): string {
    if (value.match(/\d{10}/) === null) return "invalid input";
    return `+38 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6,8)}-${value.slice(8, 10)}`;
  }

}
