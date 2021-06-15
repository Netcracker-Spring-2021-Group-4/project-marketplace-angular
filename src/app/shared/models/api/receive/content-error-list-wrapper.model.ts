export class ContentErrorListWrapper<T> {
  content: T
  errors: string[]

  constructor(init: Partial<ContentErrorListWrapper<T>>) {
    Object.assign(this, init);
  }
}
