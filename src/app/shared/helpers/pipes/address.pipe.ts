import { Pipe, PipeTransform } from '@angular/core';
import {AddressModel} from "../../models/api/receive/address.model";

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(value: AddressModel, ...args: unknown[]): unknown {
    let basic = `${value.city} - ${value.street} - ${value.building}`;
    if (value.flat !== null) basic += ` | ${value.flat}`;
    return basic;
  }

}
