import {CartItemModel} from "../../../../shared/models/api/send/cart-item.model";
import {CartProductInfo} from "../../../../shared/models/api/receive/cart-product-info.model";
import {CartInfoResponse} from "../../../../shared/models/api/receive/cart-info-response.model";

export const sortCartByName = (cart: CartInfoResponse) => {
  cart.content.sort((a,b) => a.name > b.name? 1: -1)
}

export const cartInfoToItemsList = (cartInfo: CartProductInfo[]): CartItemModel[] => {
  return cartInfo.map(item => ({productId: item.productId, quantity: item.quantity}))
}

export const equalCartItems = (serverItems: CartItemModel[], localItems: CartItemModel[]): boolean => {
  const sortFun = (a: CartItemModel, b: CartItemModel) => a.productId > b.productId ? 1 : -1;
  const sortedServer = serverItems.sort(sortFun)
  const sortedLocal = localItems.sort(sortFun)
  return JSON.stringify(sortedServer) === JSON.stringify(sortedLocal)
}

export const getDifferenceInCarts = (serverItems: CartItemModel[], localItems: CartItemModel[]): CartItemModel[] => {
  const localProductsList = localItems.map(item => item.productId)
  const temp = serverItems.filter(item => localProductsList.indexOf(item.productId) !== -1)
  if(temp.length === 0) return localItems
  const tempIds = temp.map(item => item.productId)
  localItems.forEach(item =>{
    const idx = tempIds.indexOf(item.productId)
    if ( idx !== -1) {
      const newQuantity = item.quantity - temp[idx].quantity
      if (newQuantity <= 0 ) item.quantity = 0
      else item.quantity = newQuantity
    }
  })
  return localItems.filter(i => i.quantity !== 0)
}

