export default function AutoUnsub() {
  return function (constructor: any) {
    const orig = constructor.prototype.ngOnDestroy
    constructor.prototype.ngOnDestroy = function () {
      for (const prop in this) {
        const property = this[prop]
        if (typeof property.unsubscribe === "function") {
          property.unsubscribe()
        }
      }
      if (orig) {
        orig.apply();
      }
    }
  }
}
