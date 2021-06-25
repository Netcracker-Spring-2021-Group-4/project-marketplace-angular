import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longText'
})
export class LongTextPipe implements PipeTransform {

  transform(value: string): string {
    if(value.length < 350) return value
    const untilFirstSpace = value.slice(340)
    let idx = untilFirstSpace.indexOf(' ')
    idx = idx === -1 ? untilFirstSpace.length : idx
    return value.slice(0, 340 + idx) + '...'
  }

}
