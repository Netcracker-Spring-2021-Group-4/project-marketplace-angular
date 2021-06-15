import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deEnum'
})
export class DeEnumPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.replace('_', ' ').toLowerCase();
  }

}
