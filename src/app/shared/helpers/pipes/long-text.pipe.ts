import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longText'
})
export class LongTextPipe implements PipeTransform {

  transform(value: string, max: number): string {
    if(value.length < max) return value
    const lineToStop = max - 10
    const untilFirstSpace = value.slice(lineToStop)
    let idx = untilFirstSpace.indexOf(' ')
    idx = idx === -1 ? untilFirstSpace.length : idx
    return value.slice(0, lineToStop + idx) + '...'
  }

}
