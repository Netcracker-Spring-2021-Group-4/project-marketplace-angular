import {Injectable} from "@angular/core";
import {Toaster, ToastType} from "ngx-toast-notifications";
import Labels from "../shared/models/labels/labels.constant";

@Injectable({
  providedIn: 'root'
})
export class ToasterCustomService {

  private static readonly TIME_DURATION = 4000;

  constructor(
    private toaster: Toaster
  ) {
  }

  infoNotification(text: string) {
    this.notify({text, caption: Labels.caption.info}, 'primary')
  }

  infoNotificationList(infos: string[]) {
    for (let info of infos) {
      this.infoNotification(info)
    }
  }

  successfulNotification(text: string) {
    this.notify({text, caption: Labels.caption.success}, 'success')
  }

  errorNotification(text: string) {
    this.notify({text, caption: Labels.caption.error}, 'danger')
  }

  private notify(content: NotificationContent, type: ToastType) {
    this.toaster.open({
      text: content.text,
      caption: content.caption,
      duration: ToasterCustomService.TIME_DURATION,
      type
    })
  }
}

export class NotificationContent {
  text: string
  caption: string

  constructor(init: Partial<NotificationContent>) {
    Object.assign(this, init);
  }
}
