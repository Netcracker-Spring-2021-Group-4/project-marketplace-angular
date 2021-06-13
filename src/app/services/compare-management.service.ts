import {Injectable} from '@angular/core';
import {ToasterCustomService} from "./toaster-custom.service";
import {isValidUUID} from "../shared/helpers/util-functions.helper";
import Labels from "../shared/models/labels/labels.constant";

@Injectable({
  providedIn: 'root'
})
export class CompareManagementService {

  private static readonly COMPARISON_LIST_STORAGE = 'comparison_list'

  constructor(
    private toaster: ToasterCustomService
  ) {
  }

  get comparisonList() {
    return JSON.parse(localStorage.getItem(CompareManagementService.COMPARISON_LIST_STORAGE) ?? '[]')
  }

  emptyList() {
    localStorage.setItem(CompareManagementService.COMPARISON_LIST_STORAGE, JSON.stringify([]))
  }

  addToList(productId: string) {
    const list = this.comparisonList
    if(list.length === 10){
      this.toaster.errorNotification(Labels.comparison.listIsMaxedOut)
      return
    }
    if(!isValidUUID(productId)){
      this.toaster.errorNotification(Labels.cart.wrongFormatUUID)
      return
    }
    const idx = list.indexOf(productId)
    if( idx > -1){
      this.toaster.errorNotification(Labels.comparison.alreadyInTheList)
      return
    }
    list.push(productId)
    CompareManagementService.updateList(list)
    this.toaster.successfulNotification(Labels.comparison.itemAdded)
  }

  removeFromList(productId: string) {
    const list = this.comparisonList
    const idx = list.indexOf((id: string) => id === productId)
    list.splice(idx, 1)
    CompareManagementService.updateList(list)
    this.toaster.infoNotification(Labels.comparison.itemRemoved)
  }

  private static updateList(list: string[]) {
    localStorage.setItem(CompareManagementService.COMPARISON_LIST_STORAGE, JSON.stringify(list))
  }
}
