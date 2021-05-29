export class EagerContentPage<T> {
  content: T[];
  numPages: number;
  fullPageSize : number;

  constructor(init: Partial<EagerContentPage<T>>) {
    Object.assign(this, init);
  }
}
