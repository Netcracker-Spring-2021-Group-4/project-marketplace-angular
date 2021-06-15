export class AddressModel {
  city: string;
  street : string;
  building: string;
  flat ?: number;

  constructor(init: Partial<AddressModel>) {
    Object.assign(this, init);
  }
}
