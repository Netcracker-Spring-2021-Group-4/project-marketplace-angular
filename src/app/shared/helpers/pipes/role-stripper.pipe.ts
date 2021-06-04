import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleStripper'
})
export class RoleStripperPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace('ROLE_', '').replace('_', ' ');
  }

}
