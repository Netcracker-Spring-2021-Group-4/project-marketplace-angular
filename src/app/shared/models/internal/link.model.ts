export class Link {
  label : string;
  url: string;
  icon ?: string;

  constructor(init: Partial<Link>) {
    Object.assign(this, init);
  }
}
