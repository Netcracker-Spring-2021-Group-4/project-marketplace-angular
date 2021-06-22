export class AuctionType {
  typeId: number;
  name: 'ASCENDING' | 'DESCENDING'


  constructor(init: Partial<AuctionType>) {
    Object.assign(this, init);
  }
}
