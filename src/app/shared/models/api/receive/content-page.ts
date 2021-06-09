export class ContentPage<T> {
  content: T[];
  totalItems: number;

  constructor(init: Partial<ContentPage<T>>) {
    Object.assign(this, init);
  }
}
